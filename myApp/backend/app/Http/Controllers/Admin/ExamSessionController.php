<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExamSession;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ExamSessionController extends Controller
{
    public function index()
    {
        $sessions = ExamSession::latest()->paginate(10);

        // Récupère le nombre de candidats par session
        $ids = $sessions->pluck('id');
        $counts = Student::select('exam_session_id', DB::raw('COUNT(*) as cnt'))
            ->whereIn('exam_session_id', $ids)
            ->groupBy('exam_session_id')
            ->pluck('cnt', 'exam_session_id');

        $sessions->setCollection(
            $sessions->getCollection()->map(function ($s) use ($counts) {
                $s->candidates_count = (int) ($counts[$s->id] ?? 0);
                return $s;
            })
        );

        if (request()->expectsJson()) {
            return response()->json([
                'data' => $sessions->items(),
                'meta' => [
                    'current_page' => $sessions->currentPage(),
                    'last_page' => $sessions->lastPage(),
                    'total' => $sessions->total(),
                ],
            ]);
        }

        return view('admin.exam_sessions.index', ['sessions' => $sessions->items()]);
    }

    public function create()
    {
        return view('admin.exam_sessions.create');
    } 

    public function store(Request $request)
    {
        file_put_contents('/home/stj/AATW_Groupe5/.cursor/debug.log', json_encode([
            'id' => 'log_' . time() . '_1',
            'timestamp' => time() * 1000,
            'location' => 'ExamSessionController.php:51',
            'message' => 'store called',
            'data' => ['request_data' => $request->all()],
            'sessionId' => 'debug-session',
            'runId' => 'run2',
            'hypothesisId' => 'C'
        ]) . "\n", FILE_APPEND);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'class_groups' => 'nullable|array',
            'class_groups.*' => 'string',
            'exam_type' => 'nullable|in:BEPC,BAC',
            'subjects_config' => 'nullable|array',
            'subjects_config.exam_type' => 'nullable|in:BEPC,BAC',
            'subjects_config.subjects' => 'nullable|array',
            'subjects_config.subjects.*.subject_id' => 'required_with:subjects_config.subjects.*|integer|exists:subjects,id',
            'subjects_config.subjects.*.coefficients' => 'nullable|array',
        ]);

        // Ajout du statut par défaut (ouvert à la création)
        $validated['status'] = 'open';

        // Empêcher les chevauchements de périodes avec des sessions existantes
        $overlapExists = ExamSession::query()
            ->where(function ($q) use ($validated) {
                $q->where('start_date', '<=', $validated['end_date'])
                  ->where('end_date', '>=', $validated['start_date']);
            })
            ->exists();

        if ($overlapExists) {
            return $request->expectsJson()
                ? response()->json([
                    'message' => 'Validation error',
                    'errors' => [
                        'date_range' => ["Les dates sélectionnées se chevauchent avec une autre session d'examen."],
                    ],
                ], 422)
                : back()->withErrors(['date_range' => "Les dates sélectionnées se chevauchent avec une autre session d'examen."]);
        }

        $classGroups = $validated['class_groups'] ?? [];
        unset($validated['class_groups']);

        // subjects_config sera automatiquement casté en JSON par Laravel grâce au $casts dans le modèle
        $session = ExamSession::create($validated);

        if (!empty($classGroups)) {
            $this->attachClassGroups($session, $classGroups);
        }

        if (request()->expectsJson()) {
            return response()->json([
                'success' => true, 
                'message' => 'Session créée avec succès',
                'data' => $session
            ]);
        }

        return redirect()->route('admin.exam-sessions.index')
                         ->with('success', 'Session créée avec succès');
    }

    private function attachClassGroups(ExamSession $session, array $classGroups): void
    {
        $criteria = collect($classGroups)
            ->map(function ($identifier) {
                [$schoolId, $classLevel, $series] = array_pad(explode('|', $identifier), 3, null);
                return [
                    'school_id' => $schoolId,
                    'class_level' => $classLevel,
                    'series' => $series ?: null,
                ];
            });

        $query = Student::whereNull('exam_session_id');

        $query->where(function ($q) use ($criteria) {
            foreach ($criteria as $group) {
                $q->orWhere(function ($sub) use ($group) {
                    $sub->where('school_id', $group['school_id'])
                        ->where('class_level', $group['class_level']);

                    if ($group['series']) {
                        $sub->where('series', $group['series']);
                    }
                });
            }
        });

        $students = $query->get();

        foreach ($students as $student) {
            $student->exam_session_id = $session->id;
            $student->save();
        }
    }

    private function ensureStudentSubjects(Student $student, $subjects): void
    {
        $existingIds = $student->subjects->pluck('id')->all();

        $attachData = [];
        foreach ($subjects as $subject) {
            if (in_array($subject->id, $existingIds, true)) {
                continue;
            }

            $attachData[$subject->id] = [
                'coefficient' => $subject->default_coefficient ?? 1.0,
                'note' => null,
            ];
        }

        if (!empty($attachData)) {
            $student->subjects()->attach($attachData);
            $student->load('subjects');
        }
    }

    /**
     * Assure que l'étudiant a uniquement les matières configurées dans la session
     * avec les coefficients appropriés selon sa filière
     */
    private function ensureSessionSubjects(Student $student, $subjects, $coefficientsMap): void
    {
        $existingIds = $student->subjects->pluck('id')->all();
        $studentSerieCode = $student->serie->code ?? 'ALL'; // Par défaut 'ALL' si pas de série
        
        $attachData = [];
        foreach ($subjects as $subjectId => $subject) {
            // $subjectId est la clé (l'ID) et $subject est l'objet Subject
            
            // Si la matière existe déjà, mettre à jour le coefficient si nécessaire
            if (in_array($subjectId, $existingIds, true)) {
                // Mettre à jour le coefficient selon la filière
                if (isset($coefficientsMap[$subjectId])) {
                    $coeff = $coefficientsMap[$subjectId][$studentSerieCode] 
                          ?? $coefficientsMap[$subjectId]['ALL'] 
                          ?? 1.0;
                    
                    $student->subjects()->updateExistingPivot($subjectId, [
                        'coefficient' => $coeff
                    ]);
                }
                continue;
            }

            // Déterminer le coefficient selon la filière de l'étudiant
            $coeff = 1.0;
            if (isset($coefficientsMap[$subjectId])) {
                $coeff = $coefficientsMap[$subjectId][$studentSerieCode] 
                      ?? $coefficientsMap[$subjectId]['ALL'] 
                      ?? 1.0;
            }

            $attachData[$subjectId] = [
                'coefficient' => $coeff,
                'note' => null,
            ];
        }

        // Détacher les matières qui ne sont pas dans la session
        $sessionSubjectIds = $subjects->keys()->all();
        $student->subjects()->whereNotIn('subjects.id', $sessionSubjectIds)->detach();

        // Attacher les nouvelles matières
        if (!empty($attachData)) {
            $student->subjects()->attach($attachData);
        }
        
        $student->load('subjects');
    }

    public function open($examSession)
    {
        $session = ExamSession::findOrFail($examSession);
        $session->status = 'open';
        $session->save();
        
        return response()->json(['success' => true, 'message' => 'Session ouverte avec succès']);
    }

    /**
     * Récupère les étudiants d'une session d'examen spécifique
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getSessionStudents($id)
    {
        try {
            // Chargement des relations nécessaires de manière optimisée
            $session = ExamSession::with([
                'students' => function($query) {
                    $query->with([
                        'school',
                        'serie',
                        'subjects' => function($query) {
                            $query->select('subjects.id', 'name')
                                  ->withPivot('note', 'coefficient');
                        }
                    ]);
                }
            ])->findOrFail($id);

            // Récupérer les matières configurées dans la session
            $sessionSubjectIds = [];
            $subjectsConfig = $session->subjects_config;
            
            if ($subjectsConfig && isset($subjectsConfig['subjects']) && is_array($subjectsConfig['subjects'])) {
                // Extraire les IDs des matières configurées
                $sessionSubjectIds = array_map(function($subj) {
                    return $subj['subject_id'] ?? null;
                }, $subjectsConfig['subjects']);
                
                $sessionSubjectIds = array_filter($sessionSubjectIds);
                
                // Charger uniquement ces matières
                $subjects = Subject::whereIn('id', $sessionSubjectIds)->get()->keyBy('id');
                
                // Créer un mapping des coefficients par filière
                $coefficientsMap = [];
                foreach ($subjectsConfig['subjects'] as $subjConfig) {
                    $subjectId = $subjConfig['subject_id'] ?? null;
                    if ($subjectId && isset($subjConfig['coefficients'])) {
                        $coefficientsMap[$subjectId] = $subjConfig['coefficients'];
                    }
                }
                
                // Pour chaque étudiant, créer uniquement les matières de la session
                $session->students->each(function ($student) use ($subjects, $coefficientsMap) {
                    $this->ensureSessionSubjects($student, $subjects, $coefficientsMap);
                });
            } else {
                // Si pas de configuration, utiliser toutes les matières (comportement par défaut)
                $subjects = Subject::select('id', 'name', 'default_coefficient')->get();
                $sessionSubjectIds = $subjects->pluck('id')->all();
                $session->students->each(function ($student) use ($subjects) {
                    $this->ensureStudentSubjects($student, $subjects);
                });
            }
            
            $finalSessionSubjectIds = $sessionSubjectIds; // Pour utiliser dans la closure
            $students = $session->students->map(function($student) use ($finalSessionSubjectIds) {
                // Filtrer les matières pour ne garder que celles de la session
                $studentSubjects = $student->subjects;
                
                if (!empty($finalSessionSubjectIds)) {
                    $studentSubjects = $studentSubjects->filter(function($subject) use ($finalSessionSubjectIds) {
                        return in_array($subject->id, $finalSessionSubjectIds);
                    });
                }
                
                return [
                    'id' => $student->id,
                    'first_name' => $student->first_name,
                    'last_name' => $student->last_name,
                    'matricule' => $student->matricule,
                    'class_level' => $student->class_level,
                    'serie' => $student->serie ? [
                        'id' => $student->serie->id,
                        'code' => $student->serie->code ?? null,
                        'nom' => $student->serie->nom ?? null,
                    ] : null,
                    'school' => $student->school ? [
                        'id' => $student->school->id,
                        'name' => $student->school->name,
                        'establishment_code' => $student->school->establishment_code
                    ] : null,
                    'subjects' => $studentSubjects->map(function($subject) {
                        return [
                            'id' => $subject->id,
                            'name' => $subject->name,
                            'coef' => (float)($subject->pivot->coefficient ?? 1.0),
                            'note' => $subject->pivot->note ? (float)$subject->pivot->note : null,
                            'is_valid' => $subject->pivot->note !== null && 
                                        is_numeric($subject->pivot->note) && 
                                        $subject->pivot->note >= 0 && 
                                        $subject->pivot->note <= 20
                        ];
                    })->values(),
                    'average' => $this->calculateStudentAverage($student),
                    'decision' => $this->determineDecision($student)
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'session' => [
                        'id' => $session->id,
                        'name' => $session->name,
                        'status' => $session->status,
                        'start_date' => $session->start_date,
                        'end_date' => $session->end_date,
                        'subjects_config' => $session->subjects_config
                    ],
                    'students' => $students
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des étudiants',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Calcule la moyenne d'un étudiant
     *
     * @param  \App\Models\Student  $student
     * @return float|null
     */
    private function calculateStudentAverage($student)
    {
        $total = 0;
        $totalCoefficients = 0;
        $hasValidNotes = false;

        foreach ($student->subjects as $subject) {
            $note = $subject->pivot->note;
            $coefficient = $subject->pivot->coefficient ?? 1.0;
            
            if (is_numeric($note) && $note >= 0 && $note <= 20) {
                $total += $note * $coefficient;
                $totalCoefficients += $coefficient;
                $hasValidNotes = true;
            }
        }

        return $hasValidNotes && $totalCoefficients > 0 ? round($total / $totalCoefficients, 2) : null;
    }

    /**
     * Détermine la décision de délibération pour un étudiant
     *
     * @param  \App\Models\Student  $student
     * @return string
     */
    private function determineDecision($student)
    {
        $average = $this->calculateStudentAverage($student);
        
        if ($average === null) {
            return 'Non noté';
        }
        
        // Vérifier si toutes les notes sont valides
        $allNotesValid = $student->subjects->every(function($subject) {
            $note = $subject->pivot->note;
            return $note !== null && is_numeric($note) && $note >= 0 && $note <= 20;
        });
        
        if (!$allNotesValid) {
            return 'Notes manquantes';
        }
        
        // Règles de décision (à adapter selon vos besoins)
        if ($average >= 10) {
            return 'Admis';
        } elseif ($average >= 7) {
            return 'Ajourné';
        } else {
            return 'Exclu';
        }
    }
    
    public function close($examSession)
    {
        $session = ExamSession::findOrFail($examSession);
        $session->status = 'closed';
        $session->save();
        
        return response()->json(['success' => true, 'message' => 'Session fermée avec succès']);
    }
    
    public function updateStatus(Request $request, $examSession)
    {
        $session = ExamSession::findOrFail($examSession);
        
        $request->validate([
            'status' => 'required|in:open,closed'
        ]);
        
        $session->status = $request->status;
        $session->save();
        
        return response()->json(['success' => true, 'message' => 'Statut mis à jour avec succès']);
    }

    /**
     * Récupère les matières disponibles par niveau d'examen (BEPC/BAC)
     * avec leurs coefficients par filière
     */
    public function getAvailableSubjects(Request $request)
    {
        $examType = $request->query('exam_type', 'BAC'); // BEPC ou BAC
        
        $config = config("exam_subjects.{$examType}");
        
        if (!$config) {
            return response()->json([
                'success' => false,
                'message' => 'Type d\'examen invalide'
            ], 400);
        }

        // Récupérer les matières depuis la base de données
        $subjects = Subject::all()->keyBy('code');
        
        $result = [
            'exam_type' => $examType,
            'filières' => $config['filières'] ?? [],
            'subjects' => []
        ];

        foreach ($config['subjects'] as $code => $subjectConfig) {
            $dbSubject = $subjects->get($code);
            if ($dbSubject) {
                $result['subjects'][] = [
                    'id' => $dbSubject->id,
                    'code' => $dbSubject->code,
                    'name' => $dbSubject->name,
                    'description' => $dbSubject->description,
                    'coefficients' => $subjectConfig['coefficients'] ?? [],
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }
}