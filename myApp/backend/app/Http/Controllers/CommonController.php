<?php

namespace App\Http\Controllers;

use App\Models\Serie;
use Illuminate\Http\Request;

class CommonController extends Controller
{
    /**
     * Récupère toutes les séries disponibles
     */
    public function getSeries()
    {
        $series = Serie::all();
        return response()->json([
            'success' => true,
            'data' => $series
        ]);
    }
}
