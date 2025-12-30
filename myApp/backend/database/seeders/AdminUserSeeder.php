<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    User::create([
        'name' => 'Admin Test',
        'username' => 'admin_test',
        'email' => 'admin@test.com',
        'password' => Hash::make('patrickadmin1234'),
        'role' => 'admin',
        'is_admin' => true,
    ]);
}
}
