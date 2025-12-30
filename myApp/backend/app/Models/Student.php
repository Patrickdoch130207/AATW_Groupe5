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
        'pob',
        'gender',
        'series',
        'photo',
        'temp_password',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function examSession(): BelongsTo
    {
        return $this->belongsTo(ExamSession::class, 'exam_session_id');
    }

    public function serie()
    {
        return $this->belongsTo(Serie::class, 'series', 'nom');
    }

    public function deliberations(): HasMany
    {
        return $this->hasMany(Deliberation::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'student_subject')
                    ->withPivot('note', 'coefficient')
                    ->withTimestamps();
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    // Accessors
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAgeAttribute(): int
    {
        return $this->birth_date ? $this->birth_date->age : 0;
    }

    public function isValidStudentNumber(): bool
    {
        return preg_match('/^[A-Z0-9]{6,12}$/', $this->matricule);
    }
}
