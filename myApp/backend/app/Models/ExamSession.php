<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamSession extends Model
{
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'status'
    ];

    protected $dates = ['start_date', 'end_date'];

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