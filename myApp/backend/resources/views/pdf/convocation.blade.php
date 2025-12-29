<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convocation - {{ $student->matricule }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #333;
            padding: 40px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #1579de;
            padding-bottom: 20px;
        }
        
        .header h1 {
            color: #1579de;
            font-size: 28pt;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
            font-size: 11pt;
        }
        
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #1579de;
            padding: 20px;
            margin: 30px 0;
        }
        
        .info-box h2 {
            color: #1579de;
            font-size: 16pt;
            margin-bottom: 15px;
        }
        
        .info-row {
            display: flex;
            margin-bottom: 10px;
        }
        
        .info-label {
            font-weight: bold;
            width: 180px;
            color: #555;
        }
        
        .info-value {
            color: #000;
        }
        
        .session-details {
            margin: 30px 0;
            padding: 20px;
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 5px;
        }
        
        .session-details h3 {
            color: #856404;
            margin-bottom: 15px;
            font-size: 14pt;
        }
        
        .instructions {
            margin: 30px 0;
            padding: 20px;
            background-color: #e7f3ff;
            border-radius: 5px;
        }
        
        .instructions h3 {
            color: #004085;
            margin-bottom: 15px;
            font-size: 14pt;
        }
        
        .instructions ul {
            list-style-position: inside;
            margin-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 8px;
            color: #004085;
        }
        
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10pt;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        
        .signature-box {
            margin-top: 40px;
            text-align: right;
        }
        
        .signature-line {
            display: inline-block;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 50px;
            min-width: 200px;
            text-align: center;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        table td {
            padding: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎓 CONVOCATION À L'EXAMEN</h1>
        <p>{{ $session->name }}</p>
    </div>

    <div class="info-box">
        <h2>Informations du Candidat</h2>
        <table>
            <tr>
                <td class="info-label">Nom et Prénoms :</td>
                <td class="info-value">{{ $student->last_name }} {{ $student->first_name }}</td>
            </tr>
            <tr>
                <td class="info-label">Matricule :</td>
                <td class="info-value">{{ $student->matricule }}</td>
            </tr>
            <tr>
                <td class="info-label">Date de naissance :</td>
                <td class="info-value">{{ \Carbon\Carbon::parse($student->birth_date)->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td class="info-label">Classe :</td>
                <td class="info-value">{{ $student->class_level }}</td>
            </tr>
            <tr>
                <td class="info-label">Établissement :</td>
                <td class="info-value">{{ $student->school->name ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <div class="session-details">
        <h3>📅 Détails de la Session d'Examen</h3>
        <table>
            <tr>
                <td class="info-label">Session :</td>
                <td class="info-value">{{ $session->name }}</td>
            </tr>
            <tr>
                <td class="info-label">Date de début :</td>
                <td class="info-value">{{ \Carbon\Carbon::parse($session->start_date)->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td class="info-label">Date de fin :</td>
                <td class="info-value">{{ \Carbon\Carbon::parse($session->end_date)->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td class="info-label">Statut :</td>
                <td class="info-value">{{ ucfirst($session->status) }}</td>
            </tr>
        </table>
    </div>

    <div class="instructions">
        <h3>📋 Instructions Importantes</h3>
        <ul>
            <li>Présentez-vous 30 minutes avant le début de l'examen</li>
            <li>Munissez-vous de cette convocation et d'une pièce d'identité valide</li>
            <li>Apportez votre matériel d'examen (stylos, calculatrice autorisée, etc.)</li>
            <li>Les téléphones portables et appareils électroniques sont strictement interdits</li>
            <li>Tout retard de plus de 15 minutes entraînera un refus d'accès à la salle</li>
        </ul>
    </div>

    <div class="signature-box">
        <p>Fait le {{ $generated_at }}</p>
        <div class="signature-line">
            Le Directeur des Examens
        </div>
    </div>

    <div class="footer">
        <p>Ce document est officiel et doit être conservé jusqu'à la fin de la session d'examen.</p>
        <p>Pour toute question, veuillez contacter l'administration de votre établissement.</p>
    </div>
</body>
</html>