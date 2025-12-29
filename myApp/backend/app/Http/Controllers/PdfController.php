<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\ExamSession;
use App\Models\Deliberation;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class PdfController extends Controller
{
    /**
     * Générer la convocation d'un étudiant (pour l'admin)
     */
    public function generateConvocationAdmin($studentId, $sessionId)
    {
        try {
            $student = Student::with('school')->findOrFail($studentId);
            $session = ExamSession::findOrFail($sessionId);

            $data = [
                'student' => $student,
                'session' => $session,
                'generated_at' => now()->format('d/m/Y à H:i'),
            ];

            $pdf = Pdf::loadView('pdf.convocation', $data);
            
            return $pdf->download("convocation_{$student->matricule}.pdf");
        } catch (\Exception $e) {
            Log::error('Erreur génération convocation: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la génération de la convocation'
            ], 500);
        }
    }

    /**
     * Générer le relevé de notes d'un étudiant (pour l'admin)
     */
    public function generateTranscriptAdmin($studentId, $sessionId)
    {
        try {
            $student = Student::with(['school', 'subjects' => function ($query) {
                $query->select('subjects.id', 'name')
                      ->withPivot('note', 'coefficient');
            }])->findOrFail($studentId);
            
            $session = ExamSession::findOrFail($sessionId);
            
            // Récupérer la délibération
            $deliberation = Deliberation::where('student_id', $studentId)
                ->where('exam_session_id', $sessionId)
                ->first();

            if (!$deliberation || !$deliberation->is_validated) {
                return response()->json([
                    'error' => 'Le relevé de notes n\'est disponible qu\'après validation de la délibération'
                ], 403);
            }

            $data = [
                'student' => $student,
                'session' => $session,
                'deliberation' => $deliberation,
                'subjects' => $student->subjects,
                'generated_at' => now()->format('d/m/Y à H:i'),
            ];

            $pdf = Pdf::loadView('pdf.releve', $data);
            
            return $pdf->download("releve_notes_{$student->matricule}.pdf");
        } catch (\Exception $e) {
            Log::error('Erreur génération relevé: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la génération du relevé de notes'
            ], 500);
        }
    }

    /**
     * Générer la convocation pour l'étudiant connecté
     */
    public function generateConvocation(Request $request, $sessionId)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 'student' || !$user->student) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $student = $user->student->load('school');
            $session = ExamSession::findOrFail($sessionId);

            // Vérifier que l'étudiant a un lien avec cette session
            $hasDeliberation = \App\Models\Deliberation::where('student_id', $student->id)
                ->where('exam_session_id', $sessionId)
                ->exists();

            if ($student->exam_session_id != $sessionId && !$hasDeliberation) {
                return response()->json(['message' => 'Vous n\'êtes pas inscrit à cette session et n\'avez aucun résultat'], 404);
            }

            $data = [
                'student' => $student,
                'session' => $session,
                'generated_at' => now()->format('d/m/Y à H:i'),
            ];

            $pdf = Pdf::loadView('pdf.convocation', $data);
            
            return $pdf->download("convocation_{$student->matricule}.pdf");
        } catch (\Exception $e) {
            Log::error('Erreur génération convocation étudiant: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la génération de la convocation'
            ], 500);
        }
    }

    /**
     * Générer le relevé de notes pour l'étudiant connecté
     */
    public function generateTranscript(Request $request, $sessionId)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 'student' || !$user->student) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $student = $user->student->load(['school', 'subjects' => function ($query) {
                $query->select('subjects.id', 'name')
                      ->withPivot('note', 'coefficient');
            }]);
            
            $session = ExamSession::findOrFail($sessionId);

            // Vérifier que l'étudiant a un lien avec cette session
            $hasDeliberation = Deliberation::where('student_id', $student->id)
                ->where('exam_session_id', $sessionId)
                ->exists();

            if ($student->exam_session_id != $sessionId && !$hasDeliberation) {
                return response()->json(['message' => 'Vous n\'êtes pas inscrit à cette session et n\'avez aucun résultat'], 404);
            }
            
            // Récupérer la délibération
            $deliberation = Deliberation::where('student_id', $student->id)
                ->where('exam_session_id', $sessionId)
                ->first();

            if (!$deliberation || !$deliberation->is_validated) {
                return response()->json([
                    'error' => 'Le relevé de notes n\'est disponible qu\'après validation de la délibération'
                ], 403);
            }

            $data = [
                'student' => $student,
                'session' => $session,
                'deliberation' => $deliberation,
                'subjects' => $student->subjects,
                'generated_at' => now()->format('d/m/Y à H:i'),
            ];

            $pdf = Pdf::loadView('pdf.releve', $data);
            
            return $pdf->download("releve_notes_{$student->matricule}.pdf");
        } catch (\Exception $e) {
            Log::error('Erreur génération relevé étudiant: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la génération du relevé de notes'
            ], 500);
        }
    }
}
