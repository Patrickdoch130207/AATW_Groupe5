<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relevé de Notes - {{ $student->matricule }}</title>
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
            color: #333;
            padding: 30px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #28a745;
            padding-bottom: 15px;
        }
        
        .header h1 {
            color: #28a745;
            font-size: 24pt;
            margin-bottom: 8px;
        }
        
        .header p {
            color: #666;
            font-size: 10pt;
        }
        
        .student-info {
            background-color: #f8f9fa;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
        }
        
        .student-info h2 {
            color: #28a745;
            font-size: 14pt;
            margin-bottom: 10px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .info-item {
            padding: 5px 0;
        }
        
        .info-label {
            font-weight: bold;
            color: #555;
            font-size: 10pt;
        }
        
        .info-value {
            color: #000;
            font-size: 10pt;
        }
        
        .grades-table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
        }
        
        .grades-table thead {
            background-color: #28a745;
            color: white;
        }
        
        .grades-table th {
            padding: 12px 8px;
            text-align: left;
            font-size: 11pt;
        }
        
        .grades-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #dee2e6;
        }
        
        .grades-table tbody tr:hover {
            background-color: #f8f9fa;
        }
        
        .grades-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        .text-center {
            text-align: center;
        }
        
        .text-right {
            text-align: right;
        }
        
        .summary-box {
            background-color: #e7f3ff;
            border: 2px solid #28a745;
            padding: 20px;
            margin: 25px 0;
            border-radius: 5px;
        }
        
        .summary-box h3 {
            color: #28a745;
            font-size: 14pt;
            margin-bottom: 15px;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            text-align: center;
        }
        
        .summary-item {
            padding: 15px;
            background-color: white;
            border-radius: 5px;
        }
        
        .summary-label {
            font-size: 10pt;
            color: #666;
            margin-bottom: 5px;
        }
        
        .summary-value {
            font-size: 20pt;
            font-weight: bold;
            color: #28a745;
        }
        
        .decision-admis {
            color: #28a745;
        }
        
        .decision-ajourne {
            color: #ffc107;
        }
        
        .decision-exclu {
            color: #dc3545;
        }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 9pt;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
        
        .signature-section {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        .signature-box {
            text-align: center;
        }
        
        .signature-line {
            border-top: 1px solid #000;
            margin-top: 40px;
            padding-top: 5px;
            font-size: 10pt;
        }
        
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80pt;
            color: rgba(40, 167, 69, 0.1);
            z-index: -1;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="watermark">OFFICIEL</div>
    
    <div class="header">
        <h1>📊 RELEVÉ DE NOTES OFFICIEL</h1>
        <p>{{ $session->name }}</p>
    </div>

    <div class="student-info">
        <h2>Informations de l'Étudiant</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Nom et Prénoms</div>
                <div class="info-value">{{ $student->last_name }} {{ $student->first_name }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Matricule</div>
                <div class="info-value">{{ $student->matricule }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Date de naissance</div>
                <div class="info-value">{{ \Carbon\Carbon::parse($student->birth_date)->format('d/m/Y') }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Classe</div>
                <div class="info-value">{{ $student->class_level }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Établissement</div>
                <div class="info-value">{{ $student->school->name ?? 'N/A' }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Session</div>
                <div class="info-value">{{ $session->name }}</div>
            </div>
        </div>
    </div>

    <h3 style="color: #28a745; margin: 25px 0 15px 0; font-size: 14pt;">📚 Détail des Notes</h3>
    
    <table class="grades-table">
        <thead>
            <tr>
                <th>Matière</th>
                <th class="text-center">Coefficient</th>
                <th class="text-center">Note / 20</th>
                <th class="text-center">Note Pondérée</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalWeighted = 0;
                $totalCoef = 0;
            @endphp
            
            @foreach($subjects as $subject)
                @php
                    $note = $subject->pivot->note ?? 0;
                    $coef = $subject->pivot->coefficient ?? 1;
                    $weighted = $note * $coef;
                    $totalWeighted += $weighted;
                    $totalCoef += $coef;
                @endphp
                <tr>
                    <td>{{ $subject->name }}</td>
                    <td class="text-center">{{ number_format($coef, 1) }}</td>
                    <td class="text-center">{{ $note !== null ? number_format($note, 2) : 'N/A' }}</td>
                    <td class="text-center">{{ number_format($weighted, 2) }}</td>
                </tr>
            @endforeach
            
            <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td>TOTAL</td>
                <td class="text-center">{{ number_format($totalCoef, 1) }}</td>
                <td class="text-center">-</td>
                <td class="text-center">{{ number_format($totalWeighted, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="summary-box">
        <h3>🎯 Résultats de la Délibération</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-label">Moyenne Générale</div>
                <div class="summary-value">{{ number_format($deliberation->average, 2) }}/20</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Décision du Jury</div>
                <div class="summary-value 
                    @if($deliberation->decision == 'Admis') decision-admis
                    @elseif($deliberation->decision == 'Ajourné') decision-ajourne
                    @else decision-exclu
                    @endif">
                    {{ $deliberation->decision }}
                </div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Statut</div>
                <div class="summary-value" style="font-size: 14pt;">
                    @if($deliberation->is_validated)
                        ✅ Validé
                    @else
                        ⏳ En attente
                    @endif
                </div>
            </div>
        </div>
        
        @if($deliberation->remarks)
            <div style="margin-top: 15px; padding: 10px; background-color: white; border-radius: 5px;">
                <strong>Observations :</strong> {{ $deliberation->remarks }}
            </div>
        @endif
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <p><strong>Le Président du Jury</strong></p>
            <div class="signature-line">Signature et cachet</div>
        </div>
        <div class="signature-box">
            <p><strong>Le Directeur de l'Établissement</strong></p>
            <div class="signature-line">Signature et cachet</div>
        </div>
    </div>

    <div class="footer">
        <p><strong>Document généré le {{ $generated_at }}</strong></p>
        <p>Ce relevé de notes est officiel et certifié conforme.</p>
        <p>Toute falsification de ce document est passible de poursuites judiciaires.</p>
    </div>
</body>
</html>