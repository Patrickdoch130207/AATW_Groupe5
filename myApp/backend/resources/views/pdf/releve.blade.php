<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relevé de Notes - {{ $candidat->numero_table }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            padding: 30px;
            color: #333;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #27ae60;
            padding-bottom: 15px;
        }
        
        .header h1 {
            color: #27ae60;
            font-size: 22pt;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        
        .header p {
            color: #7f8c8d;
            font-size: 10pt;
        }
        
        .info-candidat {
            background-color: #ecf0f1;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        
        .info-candidat h2 {
            color: #2c3e50;
            font-size: 13pt;
            margin-bottom: 10px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .info-item {
            display: flex;
        }
        
        .info-item strong {
            min-width: 140px;
            color: #34495e;
        }
        
        .notes-table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
        }
        
        .notes-table thead {
            background-color: #27ae60;
            color: white;
        }
        
        .notes-table th {
            padding: 12px;
            text-align: left;
            font-size: 11pt;
            border: 1px solid #27ae60;
        }
        
        .notes-table td {
            padding: 10px;
            border: 1px solid #ddd;
            font-size: 10pt;
        }
        
        .notes-table tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .notes-table tbody tr:hover {
            background-color: #e8f5e9;
        }
        
        .text-center {
            text-align: center;
        }
        
        .text-right {
            text-align: right;
        }
        
        .resultat {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
            text-align: center;
        }
        
        .resultat h2 {
            font-size: 16pt;
            margin-bottom: 15px;
        }
        
        .resultat .moyenne {
            font-size: 32pt;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .resultat .mention {
            font-size: 18pt;
            font-weight: bold;
            margin-top: 10px;
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 5px;
        }
        
        .mention-tb { background-color: #27ae60 !important; }
        .mention-b { background-color: #3498db !important; }
        .mention-ab { background-color: #f39c12 !important; }
        .mention-p { background-color: #95a5a6 !important; }
        .mention-aj { background-color: #e74c3c !important; }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 15px;
            border-top: 2px solid #ecf0f1;
            font-size: 9pt;
            color: #7f8c8d;
        }
        
        .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 50px;
        }
        
        .signature-box {
            text-align: center;
        }
        
        .signature-box p {
            font-weight: bold;
            margin-bottom: 40px;
        }
        
        .signature-line {
            border-top: 2px solid #333;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Relevé de Notes</h1>
        <p>Session {{ date('Y') }} - Série {{ $serie->nom }}</p>
    </div>

    <div class="info-candidat">
        <h2>👤 Informations du Candidat</h2>
        <div class="info-grid">
            <div class="info-item">
                <strong>N° Table :</strong>
                <span>{{ $candidat->numero_table }}</span>
            </div>
            <div class="info-item">
                <strong>Nom :</strong>
                <span>{{ strtoupper($candidat->nom) }}</span>
            </div>
            <div class="info-item">
                <strong>Prénom :</strong>
                <span>{{ ucfirst($candidat->prenom) }}</span>
            </div>
            <div class="info-item">
                <strong>Date de naissance :</strong>
                <span>{{ \Carbon\Carbon::parse($candidat->date_naissance)->format('d/m/Y') }}</span>
            </div>
            <div class="info-item">
                <strong>École :</strong>
                <span>{{ $ecole->nom }}</span>
            </div>
            <div class="info-item">
                <strong>Série :</strong>
                <span>{{ $serie->nom }}</span>
            </div>
        </div>
    </div>

    <table class="notes-table">
        <thead>
            <tr>
                <th style="width: 40%;">Matière</th>
                <th class="text-center" style="width: 15%;">Note</th>
                <th class="text-center" style="width: 15%;">Coefficient</th>
                <th class="text-right" style="width: 20%;">Note x Coef</th>
                <th class="text-center" style="width: 10%;">Appréciation</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalPoints = 0;
                $totalCoef = 0;
            @endphp
            
            @foreach($notes as $note)
                @php
                    $coef = $note->matiere->coefficient ?? 1;
                    $noteCoef = $note->note * $coef;
                    $totalPoints += $noteCoef;
                    $totalCoef += $coef;
                    
                    // Appréciation
                    if ($note->note >= 16) {
                        $appreciation = 'TB';
                    } elseif ($note->note >= 14) {
                        $appreciation = 'B';
                    } elseif ($note->note >= 12) {
                        $appreciation = 'AB';
                    } elseif ($note->note >= 10) {
                        $appreciation = 'P';
                    } else {
                        $appreciation = 'I';
                    }
                @endphp
                
                <tr>
                    <td>{{ $note->matiere->nom }}</td>
                    <td class="text-center"><strong>{{ number_format($note->note, 2) }}</strong></td>
                    <td class="text-center">{{ $coef }}</td>
                    <td class="text-right">{{ number_format($noteCoef, 2) }}</td>
                    <td class="text-center"><strong>{{ $appreciation }}</strong></td>
                </tr>
            @endforeach
            
            <tr style="background-color: #d5d8dc; font-weight: bold;">
                <td>TOTAL</td>
                <td class="text-center">—</td>
                <td class="text-center">{{ $totalCoef }}</td>
                <td class="text-right">{{ number_format($totalPoints, 2) }}</td>
                <td class="text-center">—</td>
            </tr>
        </tbody>
    </table>

    <div class="resultat @if($moyenne >= 10) mention-{{ strtolower(str_replace(' ', '', $mention)) }} @else mention-aj @endif">
        <h2>🏆 Résultat Final</h2>
        <div class="moyenne">{{ number_format($moyenne, 2) }} / 20</div>
        <div class="mention">{{ $mention }}</div>
    </div>

    <div style="background-color: #e8f5e9; padding: 12px; margin: 20px 0; border-left: 4px solid #27ae60;">
        <p style="font-size: 10pt; margin: 0;">
            <strong>Légende :</strong> TB = Très Bien (≥16) | B = Bien (≥14) | AB = Assez Bien (≥12) | P = Passable (≥10) | I = Insuffisant (<10)
        </p>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <p>Le Directeur de l'École</p>
            <div class="signature-line"></div>
            <p style="font-size: 9pt; color: #7f8c8d; margin-top: 5px;">Signature et cachet</p>
        </div>
        <div class="signature-box">
            <p>Le Président du Jury</p>
            <div class="signature-line"></div>
            <p style="font-size: 9pt; color: #7f8c8d; margin-top: 5px;">Signature et cachet</p>
        </div>
    </div>

    <div class="footer">
        <p>Document généré le {{ $date_generation }}</p>
        <p>Ce relevé de notes est officiel et certifié conforme</p>
    </div>
</body>
</html>