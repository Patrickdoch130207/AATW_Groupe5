<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidat_id',
        'matiere_id',
        'note',
    ];

    protected $casts = [
        'note' => 'float',
    ];

    /**
     * Relation avec le candidat
     */
    public function candidat()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Relation avec la matière
     */
    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }
}