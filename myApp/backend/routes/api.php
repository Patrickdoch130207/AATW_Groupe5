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

Route::post('/register-school', [SchoolRegistrationController::class,'registerSchool']);

// Route publique pour se connecter

Route::post('/login', [AuthController::class, 'login']);

// Routes pour se déconnecter

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Routes pour afficher les écoles en attente de validation et prendre des décisions;

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/pending', [AdminController::class, 'getPendingSchools']);
    Route::put('/admin/validate-school/{id}/validate', [AdminController::class, 'validateSchool']);
    Route::put('/admin/reject-school/{id}/reject', [AdminController::class, 'rejectSchool']);
    Route::get('/admin/schools/active', [AdminController::class, 'getActiveSchools']);
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
});

// --- ESPACE ÉCOLE ---
    Route::middleware(['auth:sanctum', 'role:school'])->group(function () {
        // Inscrire un étudiant (génération auto matricule/email)
        Route::post('/school/register-students', [StudentController::class, 'store']);
        
        // Liste des étudiants de l'école connectée
        Route::get('/school/my-students', [StudentController::class, 'index']);
        
        // Voir un étudiant spécifique
        Route::get('/school/search-students/{id}', [StudentController::class, 'show']);

        Route::get('/school/stats', [StudentController::class, 'getStats']);
    });

// --- ESPACE ÉTUDIANT ---
    Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
        // Récupérer les résultats de l'étudiant connecté
        Route::get('/student/my-results', [StudentController::class, 'getMyResults']);
        
        // Récupérer la convocation pour une session
        Route::get('/student/convocation/{sessionId}', [StudentController::class, 'getMyConvocation']);
        
        // Télécharger la convocation en PDF
        Route::get('/student/convocation/{sessionId}/pdf', [App\Http\Controllers\PdfController::class, 'generateConvocation']);
        
        // Télécharger le relevé de notes en PDF (uniquement si délibération validée)
        Route::get('/student/transcript/{sessionId}/pdf', [App\Http\Controllers\PdfController::class, 'generateTranscript']);
    });



Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('class-groups', [AdminController::class, 'getClassGroups']);
    Route::get('sessions', [ExamSessionController::class, 'index']);
    Route::post('session', [ExamSessionController::class, 'store']);
    Route::put('session/{examSession}', [ExamSessionController::class, 'updateStatus']);
    Route::get('sessions/{id}/students', [ExamSessionController::class, 'getSessionStudents']);
    Route::get('exam-subjects', [ExamSessionController::class, 'getAvailableSubjects']);
});
use App\Http\Controllers\Admin\DeliberationController;

Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('exam-sessions/{examSession}/calculate-deliberations', [DeliberationController::class, 'calculateForSession']);
    Route::post('exam-sessions/{examSession}/validate-deliberations', [DeliberationController::class, 'validateSessionDeliberations']);
    Route::get('exam-sessions/{examSession}/deliberations', [DeliberationController::class, 'getSessionDeliberations']);
    Route::post('deliberations/save-grades', [DeliberationController::class, 'saveStudentGrades']);
    
    // Routes pour générer les PDF
    Route::get('student/{studentId}/convocation/{sessionId}/pdf', [App\Http\Controllers\PdfController::class, 'generateConvocationAdmin']);
    Route::get('student/{studentId}/transcript/{sessionId}/pdf', [App\Http\Controllers\PdfController::class, 'generateTranscriptAdmin']);
    
    // Route pour les statistiques du tableau de bord
    Route::get('dashboard_stats', [AdminController::class, 'getDashboardStats']);
});
