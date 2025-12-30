<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\School; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;     
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SchoolRegistrationController extends Controller
{
    public function registerSchool(Request $request)
{
    // 1. Validation rigoureuse
    $validator = Validator::make($request->all(), [
        'email'         => 'required|email|unique:users,email',
        'password'      => 'required|min:8|confirmed',
        'school_name'   => 'required|string|max:255',
        'director_name' => 'required|string|max:255',
        'decree_number' => 'required|string|unique:schools,decree_number',
        'department'    => 'required|string',
        'city'          => 'required|string',
        'address'       => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'Données invalides', 'errors' => $validator->errors()], 422);
    }

    DB::beginTransaction();
    try {
        // 2. Création du User (identifiants)
        $user = User::create([
            'name'     => $request->school_name,
            'username' => \Illuminate\Support\Str::slug($request->school_name) . '.' . time(),
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'school',
        ]);

        // 3. Création du Profil School
        School::create([
            'user_id'       => $user->id,
            'school_name'          => $request->school_name,
            'director_name' => $request->director_name,
            'decree_number' => $request->decree_number,
            'department'    => $request->department,
            'city'          => $request->city,
            'address'       => $request->address,
            'status'   => 'pending', // L'école doit être validée par l'admin
        ]);

        DB::commit();

        return response()->json([
            'success' => true, 
            'message' => "Demande d'agrément envoyée avec succès !"
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' =>$e->getMessage()] , 500);
    }
}
}
