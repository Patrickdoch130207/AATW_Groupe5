<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\School; // Import du modèle School indispensable

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

    public function getActiveSchools()
    {
        // On récupère les établissements dont le statut est "active"
        // avec les informations de l'utilisateur associé (email, etc.)
        $activeSchools = School::where('status', 'active')
                                ->with('user')
                                ->get();

        return response()->json($activeSchools);
    }

    public function getStats()
{
    // On compte uniquement les écoles validées pour le premier badge
    $activeSchools = \App\Models\School::where('status', 'active')->count();
    
    // On compte tous les candidats inscrits dans la table students
    $totalCandidates = \App\Models\Student::count();

    // On peut aussi compter les sessions si vous avez une table dédiée
    $activeSessions = 1; 

    return response()->json([
        'schools_count' => $activeSchools,
        'candidates_count' => $totalCandidates,
        'active_session_count' => $activeSessions,
        'active_session_name' => "Session Décembre 2025"
    ]);
}
}