<?php

namespace App\Models;

<<<<<<< HEAD
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'school_id',
        'first_name',
        'last_name',
        'matricule',
        'birth_date',
        'class_level',
    ];

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
    
=======
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'student_number',
        'birth_date',
        'class',
        'gender',
        'phone',
        'address'
    ];

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
>>>>>>> e606a7b (liason ouverture de session et autres)
}
