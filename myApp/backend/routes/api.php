<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SchoolRegistrationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\Admin\ExamSessionController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
//Route pour inscription d'écoles

Route::post('/register-school', [SchoolRegistrationController::class,'register']);

// Route publique pour se connecter

Route::post('/login', [AuthController::class, 'login']);

// Routes pour se déconnecter

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Routes pour afficher les écoles en attente de validation et prendre des décisions;

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/pending-schools', [AdminController::class, 'getPendingSchools']);
    Route::post('/admin/validate-school/{id}', [AdminController::class, 'validateSchool']);
    Route::post('/admin/reject-school/{id}', [AdminController::class, 'rejectSchool']);
});

// --- ESPACE ÉCOLE ---
    Route::middleware(['auth:sanctum', 'role:school'])->group(function () {
        // Inscrire un étudiant (génération auto matricule/email)
        Route::post('/school/register-students', [StudentController::class, 'store']);
        
        // Liste des étudiants de l'école connectée
        Route::get('/school/list-students', [StudentController::class, 'index']);
        
        // Voir un étudiant spécifique
        Route::get('/school/search-students/{id}', [StudentController::class, 'show']);
    });



Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('sessions', [ExamSessionController::class, 'index']);
    Route::post('session', [ExamSessionController::class, 'store']);
    Route::put('session/{examSession}', [ExamSessionController::class, 'updateStatus']);
});

