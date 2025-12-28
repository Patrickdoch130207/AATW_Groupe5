<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    protected $fillable = [
        'deliberation_id',
        'subject_id',
        'subject_name',
        'grade',
        'coefficient',
        'weighted_grade'
    ];

    protected $casts = [
        'grade' => 'decimal:2',
        'coefficient' => 'decimal:1',
        'weighted_grade' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relations
    public function deliberation(): BelongsTo
    {
        return $this->belongsTo(Deliberation::class);
    }

    // Calcul de la note pondérée
    public function calculateWeightedGrade(): float
    {
        return round($this->grade * $this->coefficient, 2);
    }

    // Validation de la note
    public function isValid(): bool
    {
        return $this->grade >= 0 && $this->grade <= 20;
    }

    // Sauvegarde automatique de la note pondérée
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($grade) {
            if ($grade->grade && $grade->coefficient) {
                $grade->weighted_grade = $grade->calculateWeightedGrade();
            }
        });
    }
}
