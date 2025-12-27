<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login'])->name('login.post');

