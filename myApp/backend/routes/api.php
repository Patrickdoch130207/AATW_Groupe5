<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SchoolRegistrationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\Admin\ExamSessionController;
use App\Http\Controllers\Admin\DeliberationController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\CommonController;

Route::get('/up', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route publique pour inscription d'écoles
Route::post('/register-school', [SchoolRegistrationController::class, 'registerSchool']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/series', [CommonController::class, 'getSeries']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- ESPACE ADMIN ---
    Route::middleware('role:admin')->group(function () {
        // Gestion des écoles
        Route::get('/admin/pending-schools', [AdminController::class, 'getPendingSchools']);
        Route::get('/admin/active-schools', [AdminController::class, 'getActiveSchools']);
        Route::get('/admin/rejected-schools', [AdminController::class, 'getRejectedSchools']);
        Route::put('/admin/schools/{id}/status', [AdminController::class, 'updateSchoolStatus']);
        Route::put('/admin/schools/{id}', [AdminController::class, 'updateSchool']);
        Route::post('/admin/validate-school/{id}', [AdminController::class, 'validateSchool']);
        Route::post('/admin/reject-school/{id}', [AdminController::class, 'rejectSchool']);
        
        // Anciens noms pour compatibilité frontend si besoin
        Route::get('/admin/pending', [AdminController::class, 'getPendingSchools']);
        Route::get('/admin/schools/active', [AdminController::class, 'getActiveSchools']);
        Route::get('/admin/stats', [AdminController::class, 'getStats']);

        // Gestion SESSIONS & DELIBERATIONS
        Route::prefix('admin')->group(function () {
            Route::get('class-groups', [AdminController::class, 'getClassGroups']);
            Route::get('sessions', [ExamSessionController::class, 'index']);
            Route::post('session', [ExamSessionController::class, 'store']);
            Route::put('session/{examSession}', [ExamSessionController::class, 'updateStatus']);
            Route::get('sessions/{id}/students', [ExamSessionController::class, 'getSessionStudents']);
            Route::get('exam-subjects', [ExamSessionController::class, 'getAvailableSubjects']);
            
            Route::post('exam-sessions/{examSession}/calculate-deliberations', [DeliberationController::class, 'calculateForSession']);
            Route::post('exam-sessions/{examSession}/validate-deliberations', [DeliberationController::class, 'validateSessionDeliberations']);
            Route::get('exam-sessions/{examSession}/deliberations', [DeliberationController::class, 'getSessionDeliberations']);
            Route::post('deliberations/save-grades', [DeliberationController::class, 'saveStudentGrades']);
            
            // Détails pour impression PrintLayout (Admin)
            Route::get('student/{studentId}/convocation-details/{sessionId}', [AdminController::class, 'getStudentConvocationDetails']);
            Route::get('student/{studentId}/transcript-details/{sessionId}', [AdminController::class, 'getStudentTranscriptDetails']);

            // Routes pour générer les PDF
            Route::get('student/{studentId}/convocation/{sessionId}/pdf', [PdfController::class, 'generateConvocationAdmin']);
            Route::get('student/{studentId}/transcript/{sessionId}/pdf', [PdfController::class, 'generateTranscriptAdmin']);
            
            // Route pour les statistiques du tableau de bord
            Route::get('dashboard_stats', [AdminController::class, 'getDashboardStats']);
        });
    });

    // --- ESPACE ÉCOLE ---
    Route::middleware('role:school')->group(function () {
        Route::post('/school/register-students', [StudentController::class, 'store']);
        Route::get('/school/my-students', [StudentController::class, 'index']);
        Route::get('/school/search-students/{id}', [StudentController::class, 'show']);
        Route::get('/school/stats', [StudentController::class, 'getStats']);
        
        // Alias compatibilité
        Route::get('/school/list-students', [StudentController::class, 'index']);
        Route::get('/candidats', [StudentController::class, 'index']); 
    });

    // --- ESPACE ÉTUDIANT ---
    Route::middleware('role:student')->group(function () {
        Route::get('/student/my-results', [StudentController::class, 'getMyResults']);
        Route::get('/student/convocation/{sessionId}', [StudentController::class, 'getMyConvocation']);
        Route::get('/student/transcript-details/{sessionId}', [StudentController::class, 'getTranscriptDetails']);
        
        // Téléchargement PDF
        Route::get('/student/convocation/{sessionId}/pdf', [PdfController::class, 'generateConvocation']);
        Route::get('/student/transcript/{sessionId}/pdf', [PdfController::class, 'generateTranscript']);
    });
});
