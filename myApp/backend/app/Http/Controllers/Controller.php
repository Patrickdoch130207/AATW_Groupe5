<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
<<<<<<< HEAD
    //
}

use App\Services\UserGenerationService;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    public function store(Request $request, UserGenerationService $generator)
    {
        $request->validate([
            'name'  => 'required|string',
            'email' => 'required|email|unique:users',
        ]);

        $result = $generator->createCandidate($request->name, $request->email);

        // Vous pouvez maintenant afficher le mot de passe à l'écran une seule fois
        return back()->with('success', "Candidat créé ! ID: {$result['user']->username} | MDP: {$result['plain_password']}");
    }
}
=======
    use AuthorizesRequests, ValidatesRequests;
}
>>>>>>> e606a7b (liason ouverture de session et autres)
