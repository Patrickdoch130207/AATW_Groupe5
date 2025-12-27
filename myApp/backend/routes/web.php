<?php

use Illuminate\Support\Facades\Route;

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
