<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'establishment_code',
        'address',
        'phone',
        'contact_email',
        'justification_path',
        'status',
    ];

    // Lien vers le compte utilisateur (Authentification)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Une école possède plusieurs élèves
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}