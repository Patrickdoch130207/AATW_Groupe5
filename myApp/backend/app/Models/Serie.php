<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Serie extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'code',
    ];

    /**
     * Relation avec les candidats
     */
    public function candidats()
    {
        return $this->hasMany(Student::class);
    }

    /**
     * Relation avec les matières
     */
    public function matieres()
    {
        return $this->hasMany(Matiere::class);
    }
}