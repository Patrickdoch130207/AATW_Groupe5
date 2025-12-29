<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\School; // Import du modèle School indispensable
use App\Models\ExamSession;
use App\Models\Student;
use App\Models\Deliberation;

class AdminController extends Controller
{
    // 1. Lister les écoles qui attendent une validation
    public function getPendingSchools()
    {
        // On récupère les profils "pending" avec les infos de l'utilisateur lié
        $pendingSchools = School::where('status', 'pending')
                                ->with('user') // Charge l'email de l'user si besoin
                                ->get();

        return response()->json($pendingSchools);
    }

    // 2. Valider une école spécifique
    public function validateSchool($id)
    {
        // On cherche directement dans la table schools par son ID
        $school = School::findOrFail($id);
        
        $school->status = 'active';
        $school->save();

        return response()->json([
            'message' => "L'établissement {$school->name} a été validé avec succès."
        ]);
    }

    // 3. Rejeter une école
    public function rejectSchool($id)
    {
        $school = School::findOrFail($id);
        
        $school->status = 'rejected';
        $school->save();

        return response()->json([
            'message' => "L'inscription de {$school->name} a été rejetée."
        ]);
    }

    // 4. Récupérer les écoles actives
    public function getActiveSchools()
    {
        $activeSchools = School::where('status', 'active')
                                ->with('user')
                                ->get();

        return response()->json($activeSchools);
    }

    // 5. Mettre à jour le statut d'une école
    public function updateSchoolStatus($id, Request $request)
    {
        $school = School::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:pending,active,rejected'
        ]);

        $school->status = $request->status;
        $school->save();

        return response()->json([
            'message' => 'Statut mis à jour avec succès',
            'school' => $school
        ]);
    }

    // 6. Mettre à jour les informations d'une école
    public function updateSchool($id, Request $request)
    {
        $school = School::findOrFail($id);
        
        // Mise à jour des champs autorisés
        $school->fill($request->only([
            'name', 'address', 'city', 'phone', 
            'director_name', 'decree_number', 'is_center'
        ]));
        
        $school->save();

        return response()->json([
            'message' => 'École mise à jour avec succès',
            'school' => $school
        ]);
    }

    /**
     * Récupère les statistiques pour le tableau de bord administrateur
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDashboardStats()
    {
        try {
            // Récupérer la session active
            $activeSession = ExamSession::where('status', 'open')->first();
            
            $stats = [
                'schools_count' => School::where('status', 'active')->count(),
                'candidates_count' => Student::count(),
                'active_session_count' => ExamSession::where('status', 'open')->count(),
                'active_session_name' => $activeSession ? $activeSession->name : null,
                'pending_deliberations' => Deliberation::where('is_validated', false)->count(),
            ];

            return response()->json($stats);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retourne les classes disponibles par école pour l'ouverture des sessions.
     */
    public function getClassGroups()
    {
        $classes = Student::select('school_id', 'class_level', 'series', DB::raw('COUNT(*) as students_count'))
            ->whereNotNull('class_level')
            ->whereNull('exam_session_id')
            ->with('school:id,name')
            ->groupBy('school_id', 'class_level', 'series')
            ->orderBy('class_level')
            ->orderBy('school_id')
            ->get()
            ->map(function ($item) {
                $series = $item->series ?: null;
                $schoolName = optional($item->school)->name ?? 'Établissement';

                return [
                    'id' => implode('|', [$item->school_id, $item->class_level, $series ?? '']),
                    'school_id' => $item->school_id,
                    'school_name' => $schoolName,
                    'class_level' => $item->class_level,
                    'series' => $series,
                    'students_count' => (int) $item->students_count,
                    'label' => sprintf(
                        'Classe de %s – %s%s',
                        strtoupper($item->class_level),
                        $schoolName,
                        $series ? " – Série {$series}" : ''
                    ),
                ];
            })
            ->values();

        return response()->json($classes);
    }

    /**
     * Récupère les détails complets d'un étudiant pour l'impression de la convocation (pour admin)
     */
    public function getStudentConvocationDetails($studentId, $sessionId)
    {
        $student = Student::with(['school', 'serie'])->findOrFail($studentId);
        $session = ExamSession::findOrFail($sessionId);

        return response()->json([
            'success' => true,
            'data' => [
                'student' => $student,
                'session' => $session
            ]
        ]);
    }
    public function getStudentTranscriptDetails($studentId, $sessionId)
    {
        $student = Student::with(['school', 'subjects' => function ($query) {
            $query->withPivot('note', 'coefficient');
        }])->findOrFail($studentId);

        $session = ExamSession::findOrFail($sessionId);
        
        $deliberation = Deliberation::where('student_id', $studentId)
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