<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Deliberation extends Model
{
    protected $fillable = [
        'exam_session_id',
        'student_id',
        'average',
        'decision',
        'remarks',
        'is_validated'
    ];

    protected $casts = [
        'average' => 'decimal:2',
        'is_validated' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relations
    public function examSession(): BelongsTo
    {
        return $this->belongsTo(ExamSession::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    // Calcul de la moyenne pondérée
    public function calculateAverage(): float
    {
        $totalWeighted = 0;
        $totalCoefficients = 0;

        foreach ($this->grades as $grade) {
            $totalWeighted += $grade->grade * $grade->coefficient;
            $totalCoefficients += $grade->coefficient;
        }

        return $totalCoefficients > 0 ? round($totalWeighted / $totalCoefficients, 2) : 0;
    }

    // Détermination de la décision
    public function determineDecision(): string
    {
        $average = $this->average;

        if ($average >= 10) {
            return 'Admis';
        } elseif ($average >= 8) {
            return 'Ajourné';
        } else {
            return 'Exclus';
        }
    }

    // Validation automatique
    public function validateDeliberation(): void
    {
        $this->average = $this->calculateAverage();
        $this->decision = $this->determineDecision();
        $this->is_validated = true;
        $this->save();
    }
}
