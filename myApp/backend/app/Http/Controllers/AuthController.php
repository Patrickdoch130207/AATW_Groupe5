<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validation des champs
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Chercher l'utilisateur par son email
        $user = User::where('email', $request->email)->with(['school', 'student'])->first();

        // 3. Vérifier si l'utilisateur existe et si le mot de passe est correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        // 4. Vérifier si l'école est validée (Si c'est une école)
        if ($user->role === 'school' && $user->school->status !== 'active') {
            return response()->json([
                'message' => 'Votre compte est en attente de validation par un administrateur.'
            ], 403);
        }

        // 5. Créer le Token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        $userData = [
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
        ];

        // On ajoute les infos selon le rôle
        if ($user->role === 'school') {
            $userData['name'] = $user->school->name;
        } elseif ($user->role === 'student') {
            $userData['first_name'] = $user->student->first_name;
            $userData['last_name'] = $user->student->last_name;
            $userData['matricule'] = $user->student->matricule;
        }   


        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $userData
        ]);
    }

    public function logout(Request $request)
    {
        // Supprime le token actuel pour déconnecter l'utilisateur
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }
}