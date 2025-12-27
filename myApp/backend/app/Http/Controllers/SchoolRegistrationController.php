<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\School; // Ne pas oublier d'importer le modèle School
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;     // Indispensable pour DB::beginTransaction()
use Illuminate\Support\Facades\Storage;

class SchoolRegistrationController extends Controller
{
    public function register(Request $request)
    {
        // 1. VALIDATION
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'establishment_code' => 'required|string|unique:schools,establishment_code',
            'address' => 'required|string',
            'phone' => 'required|string',
            'contact_email' => 'required|email',
            'justificatif' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
        ]);

        // 2. GESTION DU FICHIER
        $path = null;
        if ($request->hasFile('justificatif')) {
            $path = $request->file('justificatif')->store('justificatifs', 'public');
        }

        // 3. TRANSACTION
        DB::beginTransaction();

        try {
            // Création de l'utilisateur (Compte de connexion)
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'school', 
            ]);

            // Création du profil de l'école (Détails métiers)
            School::create([
                'user_id' => $user->id,
                'name' => $request->name,
                'establishment_code' => $request->establishment_code,
                'address' => $request->address,
                'phone' => $request->phone,
                'contact_email' => $request->contact_email,
                'justification_path' => $path, // On enregistre le chemin du fichier ici
                'status' => 'pending',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Inscription réussie, votre établissement est en attente de validation.'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Si le fichier a été uploadé mais que la DB a échoué, on le supprime pour ne pas encombrer le serveur
            if ($path) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'message' => 'Erreur lors de l\'inscription.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}