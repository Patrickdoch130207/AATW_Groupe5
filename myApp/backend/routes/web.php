<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ExamSessionController;
use App\Http\Controllers\Admin\DeliberationController;

Route::get('/', function () {
    return view('welcome');
});


use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login'])->name('login.post');
use App\Http\Controllers\PdfController;

// Routes pour la génération de PDF
Route::prefix('pdf')->group(function () {
    
    // Convocations
    Route::get('/convocation/{candidatId}/download', [PdfController::class, 'genererConvocation'])
        ->name('pdf.convocation.download');
    
    Route::get('/convocation/{candidatId}/view', [PdfController::class, 'visualiserConvocation'])
        ->name('pdf.convocation.view');
    
    Route::get('/convocations/ecole/{ecoleId}/download', [PdfController::class, 'genererConvocationsEnMasse'])
        ->name('pdf.convocations.masse');
    
    // Relevés de notes
    Route::get('/releve/{candidatId}/download', [PdfController::class, 'genererReleve'])
        ->name('pdf.releve.download');
    
    Route::get('/releve/{candidatId}/view', [PdfController::class, 'visualiserReleve'])
        ->name('pdf.releve.view');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Groupe de routes admin
Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Routes pour les sessions d'examen
        Route::get('exam-sessions', [ExamSessionController::class, 'index'])
            ->name('exam-sessions.index');
        Route::get('exam-sessions/create', [ExamSessionController::class, 'create'])
            ->name('exam-sessions.create');
        Route::post('exam-sessions', [ExamSessionController::class, 'store'])
            ->name('exam-sessions.store');
            
        // Routes personnalisées pour ouvrir/fermer les sessions
        Route::post('exam-sessions/{examSession}/open', [ExamSessionController::class, 'open'])
            ->name('exam-sessions.open');
        Route::post('exam-sessions/{examSession}/close', [ExamSessionController::class, 'close'])
            ->name('exam-sessions.close');
            
        // Routes pour les délibérations
        Route::resource('deliberations', DeliberationController::class);
        Route::post('exam-sessions/{examSession}/calculate-deliberations', [DeliberationController::class, 'calculateForSession'])
            ->name('exam-sessions.calculate-deliberations');
        Route::post('exam-sessions/{examSession}/validate-deliberations', [DeliberationController::class, 'validateSessionDeliberations'])
            ->name('exam-sessions.validate-deliberations');
    });
