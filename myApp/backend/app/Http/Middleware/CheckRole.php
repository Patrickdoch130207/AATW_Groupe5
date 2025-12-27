<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role): Response
    {
        // Vérification si l'utilisateur est connecté ET s'il a le bon rôle
        if (Auth::check() && Auth::user()->role == $role) {
            return $next($request);
        }

        // Blocage d'accès sinon
        abort(403, "Vous n'avez pas accès à cette section.");

    return $next($request);
}
}

