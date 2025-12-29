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
            'class_level' => 'required|string',
        ]);

        $userSchool = $request->user();
        
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
                'name' => $request->first_name . ' ' . $request->last_name,
                'username' => strtolower($request->first_name) . '.' . strtolower($request->last_name),
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

    public function index(Request $request)
    {
        // 1. Récupérer l'école de l'utilisateur connecté
        $school = $request->user()->school;

        if (!$school) {
            return response()->json(['message' => 'Profil établissement non trouvé.'], 404);
        }

        // 2. Récupérer les étudiants de cette école avec les infos de compte (email)
        $students = Student::where('school_id', $school->id)
                        ->with('user:id,email') // On prend juste l'ID et l'email de la table users
                        ->latest()
                        ->get();

        return response()->json([
            'total' => $students->count(),
            'students' => $students
        ]);
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
                // Si la délibération n'est pas validée, on ne montre pas les notes ni l'issue
                $isValidated = (bool) $del->is_validated;
                
                return [
                    'id' => $del->id,
                    'session' => $del->examSession ? [
                        'id' => $del->examSession->id,
                        'name' => $del->examSession->name,
                        'start_date' => $del->examSession->start_date,
                        'end_date' => $del->examSession->end_date,
                        'status' => $del->examSession->status,
                    ] : null,
                    'average' => $isValidated ? $del->average : null,
                    'decision' => $isValidated ? $del->decision : 'En attente',
                    'is_validated' => $isValidated,
                    'remarks' => $isValidated ? $del->remarks : null,
                    'subjects' => $isValidated ? $student->subjects->map(function ($subject) {
                        return [
                            'id' => $subject->id,
                            'name' => $subject->name,
                            'coef' => (float) ($subject->pivot->coefficient ?? 1.0),
                            'note' => $subject->pivot->note !== null ? (float) $subject->pivot->note : null,
                        ];
                    }) : [],
                ];
            }),
        ]);
    }

    /**
     * Récupère la convocation pour l'étudiant connecté
     */
    public function getMyConvocation($sessionId)
    {
        $user = auth()->user();
        if (!$user->student) {
            return response()->json(['message' => 'Étudiant non trouvé'], 404);
        }

        $student = $user->student->load(['school', 'serie']);
        $session = \App\Models\ExamSession::findOrFail($sessionId);

        return response()->json([
            'success' => true,
            'data' => [
                'student' => $student,
                'session' => $session
            ]
        ]);
    }

    /**
     * Récupère les détails complets pour l'impression du relevé de notes
     */
    public function getTranscriptDetails($sessionId)
    {
        $user = auth()->user();
        if (!$user->student) {
            return response()->json(['message' => 'Étudiant non trouvé'], 404);
        }

        $student = $user->student->load(['school', 'subjects' => function ($query) {
            $query->withPivot('note', 'coefficient');
        }]);

        $session = \App\Models\ExamSession::findOrFail($sessionId);
        
        $deliberation = \App\Models\Deliberation::where('student_id', $student->id)
            ->where('exam_session_id', $sessionId)
            ->first();

        if (!$deliberation || !$deliberation->is_validated) {
            return response()->json(['message' => 'Le relevé n\'est pas encore disponible'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'candidate' => [
                    'id' => $student->id,
                    'first_name' => $student->first_name,
                    'last_name' => $student->last_name,
                    'matricule' => $student->matricule,
                    'dob' => $student->birth_date ? $student->birth_date->format('Y-m-d') : null,
                    'pob' => $student->pob ?? '---',
                    'school_name' => $student->school ? $student->school->name : '---',
                    'series_name' => $student->serie ? $student->serie->name : 'Générale',
                    'session_name' => $session->name,
                ],
                'grades' => $student->subjects->map(function ($subject) {
                    return [
                        'subject_name' => $subject->name,
                        'score' => $subject->pivot->note,
                        'coefficient' => $subject->pivot->coefficient,
                    ];
                }),
                'average' => $deliberation->average,
                'status' => strtoupper($deliberation->decision),
                'mention' => $this->calculateMention($deliberation->average),
            ]
        ]);
    }

    private function calculateMention($average)
    {
        if ($average >= 16) return 'TRÈS BIEN';
        if ($average >= 14) return 'BIEN';
        if ($average >= 12) return 'ASSEZ BIEN';
        if ($average >= 10) return 'PASSABLE';
        return '---';
    }
}