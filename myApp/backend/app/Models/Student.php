<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'school_id',
        'exam_session_id',
        'first_name',
        'last_name',
        'matricule',
        'table_number',
        'center_name',
        'birth_date',
        'class_level',
        'series',
    ];

    // Lien vers la session d'examen
    public function examSession(): BelongsTo
    {
        return $this->belongsTo(ExamSession::class, 'exam_session_id');
    }

    // Lien vers son compte utilisateur (pour se connecter plus tard)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Lien vers l'école qui l'a inscrit
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
    
    // Relation avec la série
 
    public function serie()
   {
      return $this->belongsTo(Serie::class);
   }


   // Relation avec les notes
 
    public function notes()
   {
        return $this->hasMany(Note::class);
   }
    


    protected $casts = [
        'birth_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relations
    public function deliberations(): HasMany
    {
        return $this->hasMany(Deliberation::class);
    }

    // Relation avec les matières
    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'student_subject')
                    ->withPivot('note', 'coefficient')
                    ->withTimestamps();
    }

    // Accesseur pour le nom complet
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    // Vérification du matricule
    public function isValidStudentNumber(): bool
    {
        return preg_match('/^[A-Z0-9]{6,12}$/', $this->student_number);
    }

    // Calcul de l'âge
    public function getAgeAttribute(): int
    {
        return $this->birth_date->age;
    }
}
