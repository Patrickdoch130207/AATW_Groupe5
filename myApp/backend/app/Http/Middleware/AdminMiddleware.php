<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->is_admin) {
            return $next($request);
        }

        // Si c'est une requête API, retourner une erreur JSON
        if ($request->expectsJson()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Sinon rediriger vers la page d'accueil
        return redirect('/')->with('error', 'Accès non autorisé');
    }
}
