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
    Route::get('/admin/active-schools', [AdminController::class, 'getActiveSchools']);
    Route::put('/admin/schools/{id}/status', [AdminController::class, 'updateSchoolStatus']);
    Route::put('/admin/schools/{id}', [AdminController::class, 'updateSchool']);
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

// --- ESPACE ÉTUDIANT ---
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    // Récupérer les résultats de l'étudiant connecté
    Route::get('/student/my-results', [StudentController::class, 'getMyResults']);
    
    // Récupérer la convocation pour une session
    Route::get('/student/convocation/{sessionId}', [StudentController::class, 'getMyConvocation']);
    
    // Détails pour impression PrintLayout
    Route::get('/student/transcript-details/{sessionId}', [StudentController::class, 'getTranscriptDetails']);
    
    // Télécharger la convocation en PDF
    Route::get('/student/convocation/{sessionId}/pdf', [PdfController::class, 'generateConvocation']);
    
    // Télécharger le relevé de notes en PDF (uniquement si délibération validée)
    Route::get('/student/transcript/{sessionId}/pdf', [PdfController::class, 'generateTranscript']);
});

// --- ESPACE ADMIN (GESTION SESSIONS & DELIBERATIONS) ---
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
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
