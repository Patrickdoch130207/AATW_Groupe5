<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deliberation;
use App\Models\Student;
use App\Models\ExamSession;
use Illuminate\Http\Request;

class DeliberationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin');
    }

    public function index()
    {
        $examSessions = ExamSession::with(['deliberations.student'])->get();
        return view('admin.deliberations.index', compact('examSessions'));
    }

    /**
     * Récupère toutes les délibérations d'une session
     */
    public function getSessionDeliberations(ExamSession $examSession)
    {
        $deliberations = Deliberation::where('exam_session_id', $examSession->id)
            ->with(['student:id,first_name,last_name,matricule,class_level'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $deliberations->map(function ($del) {
                return [
                    'id' => $del->id,
                    'student_id' => $del->student_id,
                    'average' => $del->average,
                    'decision' => $del->decision,
                    'is_validated' => $del->is_validated,
                    'remarks' => $del->remarks,
                    'student' => $del->student ? [
                        'id' => $del->student->id,
                        'first_name' => $del->student->first_name,
                        'last_name' => $del->student->last_name,
                        'matricule' => $del->student->matricule,
                        'class_level' => $del->student->class_level,
                    ] : null,
                ];
            }),
        ]);
    }

    public function create()
    {
        $examSessions = ExamSession::where('status', 'closed')->get();
        $students = Student::all();
        return view('admin.deliberations.create', compact('examSessions', 'students'));
    }

    public function saveStudentGrades(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|integer|exists:students,id',
            'session_id' => 'required|integer|exists:exam_sessions,id',
            'grades' => 'required|array|min:1',
            'grades.*.subject_id' => 'required|integer|exists:subjects,id',
            'grades.*.note' => 'nullable|numeric|min:0|max:20',
            'grades.*.coef' => 'nullable|numeric|min:0.1|max:20',
        ]);

        $student = Student::with([
            'subjects' => function ($query) {
                $query->select('subjects.id', 'name')
                      ->withPivot('note', 'coefficient');
            },
            'school'
        ])->findOrFail($validated['student_id']);

        if ((int) $student->exam_session_id !== (int) $validated['session_id']) {
            return response()->json([
                'success' => false,
                'message' => "L'étudiant n'est pas inscrit dans cette session.",
            ], 422);
        }

        $syncData = [];
        foreach ($validated['grades'] as $grade) {
            $subjectId = $grade['subject_id'];
            $note = array_key_exists('note', $grade) && $grade['note'] !== ''
                ? round((float) $grade['note'], 2)
                : null;
            $coef = isset($grade['coef']) ? (float) $grade['coef'] : 1.0;

            $syncData[$subjectId] = [
                'note' => $note,
                'coefficient' => round(max($coef, 0.1), 1),
            ];
        }

        if (empty($syncData)) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune note valide fournie.',
            ], 422);
        }

        $student->subjects()->syncWithoutDetaching($syncData);
        $student->load(['subjects' => function ($query) {
            $query->select('subjects.id', 'name')
                  ->withPivot('note', 'coefficient');
        }]);

        // NE PAS calculer la moyenne lors de l'enregistrement
        // La moyenne sera calculée uniquement lors du "Calcul de délibération"
        
        // Vérifier si une délibération existe déjà pour cet étudiant
        $deliberation = Deliberation::where('exam_session_id', $validated['session_id'])
            ->where('student_id', $validated['student_id'])
            ->first();

        // Si une délibération existe et qu'elle est validée, interdire la modification
        if ($deliberation && $deliberation->is_validated) {
            return response()->json([
                'success' => false,
                'message' => 'Cette délibération est déjà validée. Modification impossible.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notes enregistrées avec succès. Cliquez sur "Calculer" pour obtenir la moyenne.',
            'data' => [
                'student' => [
                    'id' => $student->id,
                    'first_name' => $student->first_name,
                    'last_name' => $student->last_name,
                    'matricule' => $student->matricule,
                    'class_level' => $student->class_level,
                    'school' => $student->school ? [
                        'id' => $student->school->id,
                        'name' => $student->school->name,
                        'establishment_code' => $student->school->establishment_code,
                    ] : null,
                    'subjects' => $student->subjects->map(function ($subject) {
                        return [
                            'id' => $subject->id,
                            'name' => $subject->name,
                            'coef' => (float) ($subject->pivot->coefficient ?? 1.0),
                            'note' => $subject->pivot->note !== null ? (float) $subject->pivot->note : null,
                        ];
                    }),
                    // Ne pas retourner average et decision lors de l'enregistrement
                ],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'exam_session_id' => 'required|exists:exam_sessions,id',
            'student_id' => 'required|exists:students,id',
            'remarks' => 'nullable|string|max:500'
        ]);

        $deliberation = Deliberation::create($validated);

        // Traitement des notes si fournies
        if ($request->has('grades')) {
            foreach ($request->grades as $gradeData) {
                if (!empty($gradeData['subject_name']) && !empty($gradeData['grade'])) {
                    $deliberation->grades()->create([
                        'subject_name' => $gradeData['subject_name'],
                        'grade' => $gradeData['grade'],
                        'coefficient' => $gradeData['coefficient'] ?? 1.0
                    ]);
                }
            }
        }

        $deliberation->validateDeliberation();

        return redirect()->route('admin.deliberations.index')
                     ->with('success', 'Délibération créée avec succès');
    }

    public function show(Deliberation $deliberation)
    {
        $deliberation->load(['grades', 'student', 'examSession']);
        return view('admin.deliberations.show', compact('deliberation'));
    }

    public function edit(Deliberation $deliberation)
    {
        $deliberation->load('grades');
        $examSessions = ExamSession::all();
        $students = Student::all();
        return view('admin.deliberations.edit', compact('deliberation', 'examSessions', 'students'));
    }

    public function update(Request $request, Deliberation $deliberation)
    {
        $validated = $request->validate([
            'remarks' => 'nullable|string|max:500'
        ]);

        $deliberation->update($validated);

        if ($request->has('grades')) {
            $deliberation->grades()->delete();
            
            foreach ($request->grades as $gradeData) {
                if (!empty($gradeData['subject_name']) && !empty($gradeData['grade'])) {
                    $deliberation->grades()->create([
                        'subject_name' => $gradeData['subject_name'],
                        'grade' => $gradeData['grade'],
                        'coefficient' => $gradeData['coefficient'] ?? 1.0
                    ]);
                }
            }
        }

        $deliberation->validateDeliberation();

        return redirect()->route('admin.deliberations.show', $deliberation)
                     ->with('success', 'Délibération mise à jour avec succès');
    }

    public function destroy(Deliberation $deliberation)
    {
        $deliberation->delete();
        return redirect()->route('admin.deliberations.index')
                     ->with('success', 'Délibération supprimée avec succès');
    }

    /**
     * Calcule les moyennes et crée/met à jour les délibérations pour tous les étudiants de la session
     */
    public function calculateForSession(ExamSession $examSession)
    {
        // Récupérer uniquement les étudiants de cette session
        $students = Student::where('exam_session_id', $examSession->id)
            ->with(['subjects' => function ($query) {
                $query->select('subjects.id', 'name')
                      ->withPivot('note', 'coefficient');
            }])
            ->get();

        $createdCount = 0;
        $updatedCount = 0;
        $skippedCount = 0;

        foreach ($students as $student) {
            $existingDeliberation = Deliberation::where('exam_session_id', $examSession->id)
                                                ->where('student_id', $student->id)
                                                ->first();

            // Si la délibération est déjà validée, on ne la recalcule pas
            if ($existingDeliberation && $existingDeliberation->is_validated) {
                $skippedCount++;
                continue;
            }

            // Calculer la moyenne depuis les notes sauvegardées
            $average = $this->calculateAverageFromSubjects($student->subjects);
            $decision = $this->determineDecisionFromAverage($average, $student->subjects);

            if ($existingDeliberation) {
                // Mettre à jour la délibération existante
                $existingDeliberation->update([
                    'average' => $average,
                    'decision' => $decision,
                    'is_validated' => false, // Reste non validée
                ]);
                $updatedCount++;
            } else {
                // Créer une nouvelle délibération
                Deliberation::create([
                    'exam_session_id' => $examSession->id,
                    'student_id' => $student->id,
                    'average' => $average,
                    'decision' => $decision,
                    'is_validated' => false,
                ]);
                $createdCount++;
            }
        }

        if (request()->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Délibérations calculées avec succès",
                'data' => [
                    'created' => $createdCount,
                    'updated' => $updatedCount,
                    'skipped' => $skippedCount,
                    'total' => $students->count(),
                ]
            ]);
        }

        return redirect()->route('admin.deliberations.index')
                     ->with('success', "{$createdCount} délibérations créées et {$updatedCount} mises à jour pour la session {$examSession->name}");
    }

    /**
     * Valide définitivement toutes les délibérations d'une session
     */
    public function validateSessionDeliberations(ExamSession $examSession)
    {
        $deliberations = Deliberation::where('exam_session_id', $examSession->id)->get();
        
        if ($deliberations->isEmpty()) {
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune délibération trouvée pour cette session. Veuillez d\'abord calculer les délibérations.',
                ], 400);
            }
            return redirect()->route('admin.deliberations.index')
                         ->with('error', 'Aucune délibération trouvée pour cette session.');
        }

        // Vérifier que toutes les délibérations ont une moyenne calculée
        $missingAverages = $deliberations->filter(function ($del) {
            return $del->average === null || $del->average === 0;
        });

        if ($missingAverages->isNotEmpty()) {
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Certaines délibérations n\'ont pas de moyenne calculée. Veuillez d\'abord calculer toutes les délibérations.',
                ], 400);
            }
            return redirect()->route('admin.deliberations.index')
                         ->with('error', 'Certaines délibérations n\'ont pas de moyenne calculée.');
        }

        $validatedCount = 0;

        foreach ($deliberations as $deliberation) {
            if (!$deliberation->is_validated) {
                $deliberation->update([
                    'is_validated' => true,
                ]);
                $validatedCount++;
            }
        }

        if (request()->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Délibérations validées avec succès",
                'data' => [
                    'validated' => $validatedCount,
                    'total' => $deliberations->count(),
                ]
            ]);
        }

        return redirect()->route('admin.deliberations.index')
                     ->with('success', "{$validatedCount} délibérations validées pour la session {$examSession->name}");
    }

    /**
     * Calcule la moyenne pondérée depuis les matières de l'étudiant
     */
    private function calculateAverageFromSubjects($subjects): float
    {
        $totalWeighted = 0;
        $totalCoefficients = 0;

        foreach ($subjects as $subject) {
            $note = $subject->pivot->note;
            $coefficient = $subject->pivot->coefficient ?? 1.0;

            if ($note !== null && is_numeric($note) && $note >= 0 && $note <= 20) {
                $totalWeighted += $note * $coefficient;
                $totalCoefficients += $coefficient;
            }
        }

        return $totalCoefficients > 0 ? round($totalWeighted / $totalCoefficients, 2) : 0.0;
    }

    /**
     * Détermine la décision selon la moyenne et les notes
     */
    private function determineDecisionFromAverage(float $average, $subjects): string
    {
        if ($average === 0.0) {
            return 'Non noté';
        }

        // Vérifier si toutes les notes sont valides
        $allNotesValid = true;
        foreach ($subjects as $subject) {
            $note = $subject->pivot->note;
            if ($note === null || !is_numeric($note) || $note < 0 || $note > 20) {
                $allNotesValid = false;
                break;
            }
        }

        if (!$allNotesValid) {
            return 'Notes manquantes';
        }

        // Règles de décision
        if ($average >= 10) {
            return 'Admis';
        } elseif ($average >= 8) {
            return 'Ajourné';
        } else {
            return 'Exclu';
        }
    }
}
