<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convocation - {{ $candidat->numero_table }}</title>
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
            padding: 40px;
            color: #333;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 20px;
        }
        
        .header h1 {
            color: #2c3e50;
            font-size: 24pt;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .header p {
            color: #7f8c8d;
            font-size: 11pt;
        }
        
        .numero-table {
            background-color: #3498db;
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            margin: 30px 0;
            border-radius: 5px;
        }
        
        .info-section {
            margin: 30px 0;
        }
        
        .info-section h2 {
            background-color: #ecf0f1;
            padding: 10px;
            color: #2c3e50;
            font-size: 14pt;
            border-left: 4px solid #3498db;
            margin-bottom: 15px;
        }
        
        .info-row {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #ecf0f1;
        }
        
        .info-label {
            font-weight: bold;
            width: 200px;
            color: #34495e;
        }
        
        .info-value {
            flex: 1;
            color: #555;
        }
        
        .instructions {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 30px 0;
        }
        
        .instructions h3 {
            color: #856404;
            margin-bottom: 10px;
            font-size: 13pt;
        }
        
        .instructions ul {
            margin-left: 20px;
            color: #856404;
        }
        
        .instructions li {
            margin: 5px 0;
        }
        
        .footer {
            margin-top: 50px;
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #ecf0f1;
            font-size: 10pt;
            color: #7f8c8d;
        }
        
        .signature {
            margin-top: 60px;
            text-align: right;
        }
        
        .signature-line {
            border-top: 2px solid #333;
            width: 250px;
            margin: 10px 0 5px auto;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎓 Convocation à l'Examen</h1>
        <p>Session {{ date('Y') }}</p>
    </div>

    <div class="numero-table">
        NUMÉRO DE TABLE : {{ $candidat->numero_table }}
    </div>

    <div class="info-section">
        <h2>📋 Informations du Candidat</h2>
        
        <div class="info-row">
            <div class="info-label">Nom complet :</div>
            <div class="info-value">{{ strtoupper($candidat->nom) }} {{ ucfirst($candidat->prenom) }}</div>
        </div>
        
        <div class="info-row">
            <div class="info-label">Date de naissance :</div>
            <div class="info-value">{{ \Carbon\Carbon::parse($candidat->date_naissance)->format('d/m/Y') }}</div>
        </div>
        
        <div class="info-row">
            <div class="info-label">Lieu de naissance :</div>
            <div class="info-value">{{ $candidat->lieu_naissance }}</div>
        </div>
        
        <div class="info-row">
            <div class="info-label">Sexe :</div>
            <div class="info-value">{{ $candidat->sexe == 'M' ? 'Masculin' : 'Féminin' }}</div>
        </div>
    </div>

    <div class="info-section">
        <h2>🏫 Informations Scolaires</h2>
        
        <div class="info-row">
            <div class="info-label">École :</div>
            <div class="info-value">{{ $ecole->nom }}</div>
        </div>
        
        <div class="info-row">
            <div class="info-label">Adresse de l'école :</div>
            <div class="info-value">{{ $ecole->adresse }}</div>
        </div>
        
        <div class="info-row">
            <div class="info-label">Série :</div>
            <div class="info-value">{{ $serie->nom }}</div>
        </div>
    </div>

    <div class="instructions">
        <h3>⚠️ Instructions Importantes</h3>
        <ul>
            <li>Présentez-vous au centre d'examen 30 minutes avant le début des épreuves</li>
            <li>Munissez-vous de cette convocation et d'une pièce d'identité valide</li>
            <li>Apportez votre matériel d'écriture (stylos, crayons, gomme, règle)</li>
            <li>Les téléphones portables et appareils électroniques sont strictement interdits</li>
            <li>Tout retard supérieur à 15 minutes entraînera le refus d'accès à la salle</li>
        </ul>
    </div>

    <div class="signature">
        <p><strong>Le Président du Jury</strong></p>
        <div class="signature-line"></div>
        <p style="font-size: 10pt; color: #7f8c8d;">Signature et cachet</p>
    </div>

    <div class="footer">
        <p>Document généré le {{ $date_generation }}</p>
        <p>Bonne chance à tous les candidats ! 🍀</p>
    </div>
</body>
</html>