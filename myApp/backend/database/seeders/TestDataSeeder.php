<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $schools = [
            [
                'name' => 'College Saint-Francois',
                'email' => 'saintfrancois@school.test',
                'username' => 'SCH-CSF001',
                'code' => 'CSF001',
                'address' => 'Cotonou',
                'phone' => '22961000001',
                'contact' => 'contact@saintfrancois.test',
                'students' => [
                    [
                        'first_name' => 'Aline',
                        'last_name' => 'Kossi',
                        'email' => 'aline.kossi@student.test',
                        'username' => 'STD-0001',
                        'matricule' => 'STF-0001',
                        'class_level' => '3e',
                        'birth_date' => '2010-05-12',
                        'gender' => 'F',
                    ],
                    [
                        'first_name' => 'Brice',
                        'last_name' => 'Akpo',
                        'email' => 'brice.akpo@student.test',
                        'username' => 'STD-0002',
                        'matricule' => 'STF-0002',
                        'class_level' => '3e',
                        'birth_date' => '2010-02-03',
                        'gender' => 'M',
                    ],
                ],
            ],
            [
                'name' => 'Lycee Victor Hugo',
                'email' => 'victorhugo@school.test',
                'username' => 'SCH-LVH001',
                'code' => 'LVH001',
                'address' => 'Porto-Novo',
                'phone' => '22961000002',
                'contact' => 'contact@victorhugo.test',
                'students' => [
                    [
                        'first_name' => 'Clarisse',
                        'last_name' => 'Adeoti',
                        'email' => 'clarisse.adeoti@student.test',
                        'username' => 'STD-0003',
                        'matricule' => 'LVH-0001',
                        'class_level' => 'Tle',
                        'series' => 'D',
                        'birth_date' => '2008-09-25',
                        'gender' => 'F',
                    ],
                    [
                        'first_name' => 'David',
                        'last_name' => 'Mensah',
                        'email' => 'david.mensah@student.test',
                        'username' => 'STD-0004',
                        'matricule' => 'LVH-0002',
                        'class_level' => 'Tle',
                        'series' => 'C',
                        'birth_date' => '2008-11-14',
                        'gender' => 'M',
                    ],
                ],
            ],
        ];

        foreach ($schools as $schoolData) {
            $schoolUser = User::updateOrCreate(
                ['email' => $schoolData['email']],
                [
                    'name' => $schoolData['name'] . ' (Compte)',
                    'username' => $schoolData['username'],
                    'password' => Hash::make('password123'),
                    'role' => 'school',
                    'is_admin' => false,
                ]
            );

            $school = School::updateOrCreate(
                ['establishment_code' => $schoolData['code']],
                [
                    'user_id' => $schoolUser->id,
                    'name' => $schoolData['name'],
                    'address' => $schoolData['address'],
                    'phone' => $schoolData['phone'],
                    'contact_email' => $schoolData['contact'],
                    'status' => 'active',
                ]
            );

            foreach ($schoolData['students'] as $studentData) {
                $studentUser = User::updateOrCreate(
                    ['email' => $studentData['email']],
                    [
                        'name' => $studentData['first_name'] . ' ' . $studentData['last_name'],
                        'username' => $studentData['username'],
                        'password' => Hash::make('password123'),
                        'role' => 'student',
                        'is_admin' => false,
                    ]
                );

                $student = Student::updateOrCreate(
                    ['matricule' => $studentData['matricule']],
                    [
                        'user_id' => $studentUser->id,
                        'school_id' => $school->id,
                        'first_name' => $studentData['first_name'],
                        'last_name' => $studentData['last_name'],
                        'matricule' => $studentData['matricule'],
                        'birth_date' => $studentData['birth_date'],
                        'class_level' => $studentData['class_level'],
                        'gender' => $studentData['gender'] ?? null,
                    ]
                );

                if (isset($studentData['series'])) {
                    $student->series = $studentData['series'];
                    $student->save();
                }
            }
        }
    }
}
