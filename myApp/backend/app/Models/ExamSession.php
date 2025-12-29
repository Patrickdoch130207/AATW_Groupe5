<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Student;
use App\Models\School;

class ExamSession extends Model
{
    // Relation vers les étudiants inscrits à la session
    public function students()
    {
        return $this->hasMany(Student::class, 'exam_session_id');
    }

    // Relation vers les écoles via les étudiants
    public function schools()
    {
        return $this->hasManyThrough(
            School::class,
            Student::class,
            'exam_session_id', // Clé étrangère dans la table students
            'id',              // Clé locale dans la table schools
            'id',              // Clé locale dans la table exam_sessions
            'school_id'        // Clé étrangère dans la table students
        )->distinct();
    }
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'status',
        'subjects_config'
    ];

    protected $dates = ['start_date', 'end_date'];

    protected $casts = [
        'subjects_config' => 'array',
    ];

    // Vérifie si la session peut être ouverte
    public function canBeOpened()
    {
        return $this->status === 'preparation';
    }

    // Ouvre la session
    public function open()
    {
        if (!$this->canBeOpened()) {
            return false;
        }
        $this->status = 'open';
        return $this->save();
    }

    // Ferme la session
    public function close()
    {
        if ($this->status !== 'open') {
            return false;
        }
        $this->status = 'closed';
        return $this->save();
    }
}