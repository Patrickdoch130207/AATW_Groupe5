<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StudentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'birth_date' => 'required|date', 
            'pob' => 'required|string|max:255', // Lieu de naissance (Frontend)
            'series' => [
                'string',
                'nullable',
                'in:A1,A2,A3,B,C,D,E,F1,F2,F3,F4,G1,G2,G3',
                'required_if:class_level,Tle'
                ], // Série (Frontend)
            'gender' => 'required|in:M,F', // Genre (Frontend)
            'class_level'=>'required|in:3e,Tle', // 
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Photo (Frontend)
        ]);

        $userSchool = $request->user();

        if ($request->hasFile('photo')) {
    // Stocke la photo dans storage/app/public/students
            $path = $request->file('photo')->store('students', 'public');
            $student->photo = $path;
            $student->save();
        }
        
        if ($userSchool->role !== 'school') {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }

        DB::beginTransaction();

        try {
            // 1. GÉNÉRATION DU MATRICULE SÉQUENTIEL (8 chiffres)
            $lastStudent = Student::latest('id')->first();
            $nextNumber = $lastStudent ? $lastStudent->id + 1 : 1;
            
            // On transforme "1" en "000001"
            $matricule = str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

            //Génération de l'email personnalisé
            $cleanLastName = strtolower(Str::slug($request->last_name));

            $email = $cleanLastName . "." . $matricule . "@examflow.com";
            
            // 3. GÉNÉRATION DU MOT DE PASSE (10 caractères aléatoires)
            $autoPassword = Str::random(10);

            // 4. Création de l'utilisateur
            $user = User::create([
                'email' => $email,
                'password' => Hash::make($autoPassword),
                'role' => 'student',
            ]);

            // 5. Création du profil étudiant
            $student = Student::create([
                'user_id' => $user->id,
                'school_id' => $userSchool->school->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'matricule' => $matricule,
                'birth_date' => $request->birth_date,
                'class_level' => $request->class_level,
                'pob'         => $request->pob,
                'class_level' => $request->class_level,
                'series'      => $request->series,
                'temp_password' => $autoPassword,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Élève inscrit avec succès',
                'credentials' => [
                    'email' => $email,
                    'password' => $autoPassword,
                    'matricule' => $matricule
                ],
                'student' => $student
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function show(Request $request, $id)
    {
        $school = $request->user()->school;

        // On cherche l'étudiant par son ID ET par le school_id pour éviter qu'une école 
        // puisse voir l'élève d'une autre école en devinant son ID.
        $student = Student::where('id', $id)
                      ->where('school_id', $school->id)
                      ->with('user:id,email')
                      ->first();

        if (!$student) {
            return response()->json([
                'message' => "Étudiant introuvable ou vous n'avez pas l'autorisation de le voir."
            ], 404);
     }

        return response()->json($student);
    }

    public function index(Request $request)
{
    // 1. Récupérer l'école liée à l'utilisateur (Admin École) connecté
    $school = $request->user()->school;

    if (!$school) {
        return response()->json(['message' => 'Profil établissement non trouvé.'], 404);
    }

    // 2. Récupérer les étudiants uniquement pour cette école
    $students = Student::where('school_id', $school->id)
                    ->with('user:id,email') // Charge l'email du compte login
                    ->latest()
                    ->get();

    // 3. Retourner les données (on les enveloppe dans 'students' pour le front)
    return response()->json([
        'total' => $students->count(),
        'students' => $students
    ]);
}

public function getStats(Request $request)
{
    $user = $request->user();
    
    // On récupère l'école via la relation définie dans le modèle User
    $school = $user->school;

    if (!$school) {
        return response()->json(['count' => 0], 200);
    }

    // Compter le nombre d'étudiants ayant le school_id de cette école
    $count = Student::where('school_id', $school->id)->count();

    return response()->json([
        'count' => $count
    ]);
}
    /**
     * Récupère les résultats (délibérations) de l'étudiant connecté
     */
    public function getMyResults(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'student' || !$user->student) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $student = $user->student;
        
        // Récupérer toutes les délibérations de l'étudiant avec les sessions et les notes
        $deliberations = \App\Models\Deliberation::where('student_id', $student->id)
            ->with([
                'examSession:id,name,start_date,end_date,status',
                'student.subjects' => function ($query) {
                    $query->select('subjects.id', 'name')
                          ->withPivot('note', 'coefficient');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $deliberations->map(function ($del) use ($student) {
                return [
                    'id' => $del->id,
                    'session' => $del->examSession ? [
                        'id' => $del->examSession->id,
                        'name' => $del->examSession->name,
                        'start_date' => $del->examSession->start_date,
                        'end_date' => $del->examSession->end_date,
                        'status' => $del->examSession->status,
                    ] : null,
                    'average' => $del->average,
                    'decision' => $del->decision,
                    'is_validated' => $del->is_validated,
                    'remarks' => $del->remarks,
                    'subjects' => $student->subjects->map(function ($subject) {
                        return [
                            'id' => $subject->id,
                            'name' => $subject->name,
                            'coef' => (float) ($subject->pivot->coefficient ?? 1.0),
                            'note' => $subject->pivot->note !== null ? (float) $subject->pivot->note : null,
                        ];
                    }),
                ];
            }),
        ]);
    }

    /**
     * Récupère la convocation de l'étudiant pour une session
     */
    public function getMyConvocation(Request $request, $sessionId)
    {
        $user = $request->user();
        
        if ($user->role !== 'student' || !$user->student) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $student = $user->student;
        
        // Vérifier que l'étudiant est bien inscrit à cette session
        if ($student->exam_session_id != $sessionId) {
            return response()->json(['message' => 'Vous n\'êtes pas inscrit à cette session'], 404);
        }

        $session = \App\Models\ExamSession::findOrFail($sessionId);
        
        return response()->json([
            'success' => true,
            'data' => [
                'student' => [
                    'id' => $student->id,
                    'first_name' => $student->first_name,
                    'last_name' => $student->last_name,
                    'matricule' => $student->matricule,
                    'birth_date' => $student->birth_date,
                    'class_level' => $student->class_level,
                    'school' => $student->school ? [
                        'id' => $student->school->id,
                        'name' => $student->school->name,
                        'establishment_code' => $student->school->establishment_code,
                    ] : null,
                ],
                'session' => [
                    'id' => $session->id,
                    'name' => $session->name,
                    'start_date' => $session->start_date,
                    'end_date' => $session->end_date,
                    'status' => $session->status,
                ],
            ],
        ]);
    }
}