<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'default_coefficient'
    ];

    protected $casts = [
        'default_coefficient' => 'decimal:1'
    ];

    /**
     * Relation avec les étudiants (many-to-many)
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_subject')
                    ->withPivot('note', 'coefficient')
                    ->withTimestamps();
    }
}
