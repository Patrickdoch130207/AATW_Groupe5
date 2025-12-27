<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StudentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'birth_date' => 'required|date',
            'class_level' => 'required|string',
        ]);

        $userSchool = $request->user();
        
        if ($userSchool->role !== 'school') {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }

        DB::beginTransaction();

        try {
            // 1. GÉNÉRATION DU MATRICULE SÉQUENTIEL (8 chiffres)
            $lastStudent = Student::latest('id')->first();
            $nextNumber = $lastStudent ? $lastStudent->id + 1 : 1;
            
            // On transforme "1" en "000001"
            $matricule = str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

            //Génération de l'email personnalisé
            $cleanLastName = strtolower(Str::slug($request->last_name));

            $email = $cleanLastName . "." . $matricule . "@examflow.com";
            
            // 3. GÉNÉRATION DU MOT DE PASSE (10 caractères aléatoires)
            $autoPassword = Str::random(10);

            // 4. Création de l'utilisateur
            $user = User::create([
                'email' => $email,
                'password' => Hash::make($autoPassword),
                'role' => 'student',
            ]);

            // 5. Création du profil étudiant
            $student = Student::create([
                'user_id' => $user->id,
                'school_id' => $userSchool->school->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'matricule' => $matricule,
                'birth_date' => $request->birth_date,
                'class_level' => $request->class_level,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Élève inscrit avec succès',
                'credentials' => [
                    'email' => $email,
                    'password' => $autoPassword,
                    'matricule' => $matricule
                ],
                'student' => $student
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        // 1. Récupérer l'école de l'utilisateur connecté
        $school = $request->user()->school;

        if (!$school) {
            return response()->json(['message' => 'Profil établissement non trouvé.'], 404);
        }

        // 2. Récupérer les étudiants de cette école avec les infos de compte (email)
        $students = Student::where('school_id', $school->id)
                        ->with('user:id,email') // On prend juste l'ID et l'email de la table users
                        ->latest()
                        ->get();

        return response()->json([
            'total' => $students->count(),
            'students' => $students
        ]);
    }


    public function show(Request $request, $id)
    {
        $school = $request->user()->school;

        // On cherche l'étudiant par son ID ET par le school_id pour éviter qu'une école 
        // puisse voir l'élève d'une autre école en devinant son ID.
        $student = Student::where('id', $id)
                      ->where('school_id', $school->id)
                      ->with('user:id,email')
                      ->first();

        if (!$student) {
            return response()->json([
                'message' => "Étudiant introuvable ou vous n'avez pas l'autorisation de le voir."
            ], 404);
     }

        return response()->json($student);
    }
}