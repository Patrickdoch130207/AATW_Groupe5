<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 

class RegisterController extends Controller
{
    
    public function login(Request $request)
    {
        // 1. Vérification des champs 
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // 2. Tentative de connecter l'utilisateur
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            
            // Si ça marche, on l'envoie vers le dashboard
            return redirect()->intended('dashboard');
        }

        // 3. Si ça échoue, on revient en arrière avec une erreur
        return back()->withErrors([
            'username' => 'Identifiants invalides ou compte inexistant.',
        ]);
    }
}