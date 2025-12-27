<?php

namespace App\Models;

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
    
}
