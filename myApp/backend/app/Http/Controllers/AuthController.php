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
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    // On charge déjà les relations ici
    $user = User::where('email', $request->email)->with(['school', 'student'])->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Les identifiants fournis sont incorrects.'],
        ]);
    }

    if ($user->role === 'school' && $user->school->status !== 'active') {
        return response()->json([
            'message' => 'Votre compte est en attente de validation par un administrateur.'
        ], 403);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    // Construction de l'objet utilisateur structuré pour le Frontend
    $userData = [
        'id' => $user->id,
        'email' => $user->email,
        'role' => $user->role,
    ];

    // On imbrique les objets pour correspondre à la logique user?.school?.name
    if ($user->role === 'school') {
        $userData['school'] = [
            'school_name' => $user->school->school_name,
            'id' => $user->school->id
        ];
    } elseif ($user->role === 'student') {
        $userData['student'] = [
            'first_name' => $user->student->first_name,
            'last_name' => $user->student->last_name,
            'matricule' => $user->student->matricule
        ];
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