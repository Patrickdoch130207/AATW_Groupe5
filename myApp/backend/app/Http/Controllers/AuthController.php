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
        // 1. Validation des champs - accepter email OU matricule
        $request->validate([
            'email' => 'required|string', // Peut être un email ou un matricule
            'password' => 'required',
        ]);

        $identifier = $request->email; // Peut être email ou matricule
        
        // 2. Chercher l'utilisateur par email OU par matricule
        $user = User::where('email', $identifier)
            ->orWhereHas('student', function ($query) use ($identifier) {
                $query->where('matricule', $identifier);
            })
            ->with(['school', 'student'])
            ->first();

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

        $clientRole = match (true) {
            $user->is_admin => 'admin',
            $user->role === 'school' => 'school',
            in_array($user->role, ['student', 'etudiant', 'user']) => 'etudiant',
            default => $user->role ?? 'etudiant',
        };

        $userData = [
            'id' => $user->id,
            'email' => $user->email,
            'role' => $clientRole,
        ];

        // On ajoute les infos selon le rôle
        if ($clientRole === 'school' && $user->school) {
            $userData['name'] = $user->school->name;
        } elseif ($clientRole === 'etudiant' && $user->student) {
            $userData['first_name'] = $user->student->first_name;
            $userData['last_name'] = $user->student->last_name;
            $userData['matricule'] = $user->student->matricule;
            $userData['school_name'] = $user->student->school ? $user->student->school->name : null;
        }

        $redirectTo = match ($clientRole) {
            'admin' => '/admin/dashboard',
            'school' => '/ecole/dashboard',
            default => '/candidat/dashboard',
        };

        $response = [
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $userData,
            'redirect_to' => $redirectTo,
        ];

        return response()->json($response);
    }

    public function logout(Request $request)
    {
        // Supprime le token actuel pour déconnecter l'utilisateur
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }
}