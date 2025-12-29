<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\School;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class NewSchoolStudentSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Créer ou Mettre à jour l'Utilisateur pour l'École
        $schoolUser = User::updateOrCreate(
            ['username' => 'ltc_admin'],
            [
                'name' => 'Lycée Technique de Cotonou',
                'email' => 'contact@ltc.bj',
                'password' => Hash::make('password123'),
                'role' => 'school',
            ]
        );

        // 2. Créer ou Mettre à jour l'École
        $school = School::updateOrCreate(
            ['user_id' => $schoolUser->id],
            [
                'name' => 'Lycée Technique de Cotonou',
                'establishment_code' => 'LTC-2025',
                'address' => 'Avenue Jean-Paul II, Cotonou',
                'phone' => '+229 21 31 00 00',
                'contact_email' => 'contact@ltc.bj',
                'status' => 'active',
            ]
        );

        // 3. Créer ou Mettre à jour l'Utilisateur pour l'Étudiant
        $studentUser = User::updateOrCreate(
            ['username' => 'koffi.salami'],
            [
                'name' => 'Koffi Salami',
                'email' => 'koffi.salami@student.bj',
                'password' => Hash::make('student123'),
                'role' => 'student',
            ]
        );

        // 4. Créer ou Mettre à jour l'Étudiant
        Student::updateOrCreate(
            ['user_id' => $studentUser->id],
            [
                'school_id' => $school->id,
                'first_name' => 'Koffi',
                'last_name' => 'Salami',
                'matricule' => 'STU-000123',
                'table_number' => 'BAC-2025-00123',
                'center_name' => 'CEG LES PYLONES',
                'birth_date' => '2005-05-15',
                'class_level' => 'Terminale C',
                'series' => 'C',
            ]
        );
    }
}
