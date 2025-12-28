<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExamSession;
use Illuminate\Http\Request;

class ExamSessionController extends Controller
{
    public function index()
    {
        $sessions = ExamSession::latest()->paginate(10);

        // Récupère le nombre de candidats par session
        $ids = $sessions->pluck('id');
        $counts = \Illuminate\Support\Facades\DB::table('candidates')
            ->select('exam_session_id', \Illuminate\Support\Facades\DB::raw('COUNT(*) as cnt'))
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date|after:yesterday',
            'end_date' => 'required|date|after:start_date',
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

        $session = ExamSession::create($validated);

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

    public function open($examSession)
    {
        $session = ExamSession::findOrFail($examSession);
        $session->status = 'open';
        $session->save();
        
        return response()->json(['success' => true, 'message' => 'Session ouverte avec succès']);
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
}