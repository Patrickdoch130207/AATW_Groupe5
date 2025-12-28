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
        $this->middleware('auth');
        $this->middleware('admin');
    }

    public function index()
    {
        $examSessions = ExamSession::with(['deliberations.student'])->get();
        return view('admin.deliberations.index', compact('examSessions'));
    }

    public function create()
    {
        $examSessions = ExamSession::where('status', 'closed')->get();
        $students = Student::all();
        return view('admin.deliberations.create', compact('examSessions', 'students'));
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

    public function calculateForSession(ExamSession $examSession)
    {
        $students = Student::all();
        $createdCount = 0;

        foreach ($students as $student) {
            $existingDeliberation = Deliberation::where('exam_session_id', $examSession->id)
                                                ->where('student_id', $student->id)
                                                ->first();

            if (!$existingDeliberation) {
                $deliberation = Deliberation::create([
                    'exam_session_id' => $examSession->id,
                    'student_id' => $student->id,
                    'average' => 0, 
                    'decision' => 'En attente',
                    'is_validated' => false
                ]);

                $createdCount++;
            }
        }

        return redirect()->route('admin.deliberations.index')
                     ->with('success', "{$createdCount} délibérations créées pour la session {$examSession->name}");
    }

    public function validateSessionDeliberations(ExamSession $examSession)
    {
        $deliberations = Deliberation::where('exam_session_id', $examSession->id)->get();
        $validatedCount = 0;

        foreach ($deliberations as $deliberation) {
            if (!$deliberation->is_validated && $deliberation->grades()->count() > 0) {
                $deliberation->validateDeliberation();
                $validatedCount++;
            }
        }

        return redirect()->route('admin.deliberations.index')
                     ->with('success', "{$validatedCount} délibérations validées pour la session {$examSession->name}");
    }
}
