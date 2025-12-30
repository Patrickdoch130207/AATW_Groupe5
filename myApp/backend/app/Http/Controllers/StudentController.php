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
        // Log de débug pour voir ce que le backend reçoit réellement
        \Illuminate\Support\Facades\Log::info('Inscription étudiant - Request Data:', $request->all());
        \Illuminate\Support\Facades\Log::info('Inscription étudiant - Files:', $request->allFiles());

        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'birth_date' => 'required|date', 
            'pob' => 'required|string|max:255',
            'series' => [
                'nullable',
                'sometimes',
                'string',
                'in:A1,A2,A3,B,C,D,E,F1,F2,F3,F4,G1,G2,G3',
                'required_if:class_level,Tle'
            ],
            'gender' => 'required|in:M,F',
            'class_level' => 'required|in:3e,Tle', 
            'photo' => 'nullable|sometimes|image|mimes:jpeg,png,jpg|max:2048',
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
                'pob'         => $request->pob,
                'series'      => $request->series,
                'temp_password' => $autoPassword,
            ]);

            if ($request->hasFile('photo')) {
                // Stocke la photo dans storage/app/public/students
                $path = $request->file('photo')->store('students', 'public');
                $student->photo = $path;
                $student->save();
            }

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
        $school = $request->user()->school;

        if (!$school) {
            return response()->json(['message' => 'Profil établissement non trouvé.'], 404);
        }

        $students = Student::where('school_id', $school->id)
                        ->with('user:id,email')
                        ->latest()
                        ->get();

        return response()->json([
            'total' => $students->count(),
            'students' => $students
        ]);
    }

    public function getStats(Request $request)
    {
        $user = $request->user();
        $school = $user->school;

        if (!$school) {
            return response()->json(['count' => 0], 200);
        }

        $count = Student::where('school_id', $school->id)->count();

        return response()->json([
            'count' => $count
        ]);
    }

    public function getMyResults(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'student' || !$user->student) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $student = $user->student;
        
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

    public function getTranscriptDetails($sessionId)
    {
        $user = auth()->user();
        if (!$user->student) {
            return response()->json(['message' => 'Étudiant non trouvé'], 404);
        }

        $session = \App\Models\ExamSession::findOrFail($sessionId);
        
        // Déterminer les matières de la session
        $sessionSubjectIds = [];
        if ($session->subjects_config && isset($session->subjects_config['subjects'])) {
            $sessionSubjectIds = array_filter(array_map(fn($s) => $s['subject_id'] ?? null, $session->subjects_config['subjects']));
        }

        $student = $user->student->load(['school', 'subjects' => function ($query) use ($sessionSubjectIds) {
            $query->withPivot('note', 'coefficient');
            if (!empty($sessionSubjectIds)) {
                $query->whereIn('subjects.id', $sessionSubjectIds);
            }
        }]);
        
        $deliberation = \App\Models\Deliberation::where('student_id', $student->id)
            ->where('exam_session_id', $sessionId)
            ->with('grades')
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
                    'dob' => $student->birth_date ? ($student->birth_date instanceof \DateTime ? $student->birth_date->format('Y-m-d') : $student->birth_date) : null,
                    'pob' => $student->pob ?? '---',
                    'school_name' => $student->school ? $student->school->name : '---',
                    'series_name' => $student->serie ? $student->serie->name : 'Générale',
                    'session_name' => $session->name,
                ],
                'grades' => $deliberation->grades->map(function ($grade) {
                    return [
                        'subject_name' => $grade->subject_name,
                        'score' => $grade->grade,
                        'coefficient' => $grade->coefficient,
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