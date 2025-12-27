<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'coefficient',
        'serie_id',
    ];

    protected $casts = [
        'coefficient' => 'integer',
    ];

    /**
     * Relation avec la série
     */
    public function serie()
    {
        return $this->belongsTo(Serie::class);
    }

    /**
     * Relation avec les notes
     */
    public function notes()
    {
        return $this->hasMany(Note::class);
    }
}