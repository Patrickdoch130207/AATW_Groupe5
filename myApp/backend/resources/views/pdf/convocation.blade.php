<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convocation - {{ $student->matricule }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #0f172a;
            padding: 48px;
            background: white;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 48px;
        }
        
        .header-left, .header-right {
            text-align: center;
            width: 250px;
        }
        
        .header-left h3, .header-right p {
            font-size: 8pt;
            font-weight: 700;
            text-transform: uppercase;
            line-height: 1.3;
            margin-bottom: 4px;
        }
        
        .header-left .divider {
            width: 48px;
            height: 2px;
            background: #e2e8f0;
            margin: 4px auto;
        }
        
        .header-left p {
            font-size: 7pt;
            font-weight: 500;
            line-height: 1.3;
        }
        
        .header-left .small-divider {
            width: 32px;
            height: 1px;
            background: #e2e8f0;
            margin: 4px auto;
        }
        
        .header-left .office {
            font-size: 6pt;
            text-transform: uppercase;
            font-weight: 700;
            color: #94a3b8;
        }
        
        .header-center {
            width: 96px;
            height: 96px;
            background: #f8fafc;
            border-radius: 16px;
            border: 2px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 20pt;
            color: #e2e8f0;
            font-style: italic;
            text-transform: uppercase;
        }
        
        .header-right p {
            font-size: 7pt;
        }
        
        .title-section {
            text-align: center;
            margin-bottom: 48px;
        }
        
        .title-box {
            display: inline-block;
            padding: 16px 40px;
            border: 4px solid #0f172a;
            margin-bottom: 16px;
            background: white;
            box-shadow: 8px 8px 0px 0px rgba(0,0,0,0.05);
        }
        
        .title-box h1 {
            font-size: 32pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -1px;
        }
        
        .session-name {
            font-size: 16pt;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .content-grid {
            display: flex;
            gap: 40px;
            margin-bottom: 48px;
        }
        
        .left-column {
            flex: 7;
        }
        
        .right-column {
            flex: 5;
        }
        
        .info-card {
            padding: 24px;
            background: rgba(248, 250, 252, 0.5);
            border-radius: 24px;
            border: 1px solid #e2e8f0;
        }
        
        .card-title {
            font-size: 7pt;
            font-weight: 900;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 16px;
        }
        
        .student-name {
            font-size: 20pt;
            font-weight: 900;
            text-transform: uppercase;
            line-height: 1;
            margin-bottom: 12px;
        }
        
        .student-firstname {
            font-size: 16pt;
            font-weight: 700;
            color: #1579de;
            margin-bottom: 16px;
        }
        
        .birth-info {
            display: flex;
            gap: 16px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
        }
        
        .birth-label {
            font-size: 7pt;
            text-transform: uppercase;
            font-weight: 700;
            color: #94a3b8;
        }
        
        .birth-value {
            font-weight: 700;
        }
        
        .access-card {
            padding: 24px;
            background: #1579de;
            color: white;
            border-radius: 24px;
            box-shadow: 0 20px 25px -5px rgba(21, 121, 222, 0.2);
        }
        
        .access-title {
            font-size: 7pt;
            font-weight: 900;
            opacity: 0.6;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 16px;
        }
        
        .matricule-label {
            font-size: 7pt;
            text-transform: uppercase;
            font-weight: 700;
            opacity: 0.6;
            margin-bottom: 4px;
        }
        
        .matricule-value {
            font-size: 20pt;
            font-family: monospace;
            font-weight: 900;
            margin-bottom: 16px;
        }
        
        .table-number-label {
            font-size: 7pt;
            text-transform: uppercase;
            font-weight: 700;
            opacity: 0.6;
            margin-bottom: 4px;
        }
        
        .table-number-value {
            font-size: 32pt;
            font-weight: 900;
            letter-spacing: -2px;
        }
        
        .center-card {
            background: white;
            border: 2px solid #0f172a;
            padding: 32px;
            border-radius: 32px;
            margin-bottom: 48px;
            display: flex;
            align-items: center;
            gap: 24px;
        }
        
        .center-icon {
            width: 64px;
            height: 64px;
            background: #0f172a;
            color: white;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 20pt;
            transform: rotate(3deg);
        }
        
        .center-info .label {
            font-size: 7pt;
            text-transform: uppercase;
            font-weight: 900;
            color: #94a3b8;
        }
        
        .center-info .name {
            font-size: 20pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #0f172a;
        }
        
        .center-info .series {
            font-size: 11pt;
            font-weight: 900;
            color: #ec8626;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 4px;
        }
        
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 80px;
            font-style: italic;
        }
        
        .footer-note {
            font-size: 7pt;
            font-weight: 500;
            max-width: 300px;
            color: #94a3b8;
        }
        
        .signature-box {
            text-align: center;
            border-top: 2px solid #0f172a;
            padding-top: 8px;
            width: 250px;
        }
        
        .signature-title {
            font-size: 9pt;
            font-weight: 900;
            text-transform: uppercase;
        }
        
        .signature-space {
            height: 80px;
        }
        
        .signature-note {
            font-size: 7pt;
            font-weight: 700;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-left">
            <h3>République du Bénin</h3>
            <div class="divider"></div>
            <p>Ministère de l'Enseignement Supérieur et de la Recherche Scientifique</p>
            <div class="small-divider"></div>
            <p class="office">Office du Baccalauréat</p>
        </div>
        
        <div class="header-center">
            {{ strtoupper(substr($student->first_name, 0, 1)) }}{{ strtoupper(substr($student->last_name, 0, 1)) }}
        </div>
        
        <div class="header-right">
            <p>OFFICE DU BACCALAURÉAT</p>
            <p>Cotonou, le {{ date('d/m/Y') }}</p>
        </div>
    </div>

    <!-- Title -->
    <div class="title-section">
        <div class="title-box">
            <h1>CONVOCATION</h1>
        </div>
        <p class="session-name">{{ $session->name }}</p>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
        <div class="left-column">
            <div class="info-card">
                <p class="card-title">Identité du Candidat</p>
                <p class="student-name">{{ strtoupper($student->last_name) }}</p>
                <p class="student-firstname">{{ $student->first_name }}</p>
                <div class="birth-info">
                    <div>
                        <p class="birth-label">Né(e) le</p>
                        <p class="birth-value">{{ \Carbon\Carbon::parse($student->birth_date)->format('d/m/Y') }}</p>
                    </div>
                    <div>
                        <p class="birth-label">à</p>
                        <p class="birth-value">{{ $student->pob ?? 'cotonou' }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-column">
            <div class="access-card">
                <p class="access-title">Accès Examen</p>
                <div>
                    <p class="matricule-label">Matricule</p>
                    <p class="matricule-value">{{ $student->matricule }}</p>
                </div>
                <div>
                    <p class="table-number-label">N° de Table</p>
                    <p class="table-number-value">{{ $student->table_number ?? '---' }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Center Card -->
    <div class="center-card">
        <div class="center-icon">
            {{ strtoupper(substr($student->serie->nom ?? 'G', 0, 1)) }}
        </div>
        <div class="center-info">
            <p class="label">Lieu de Composition</p>
            <p class="name">{{ $student->center_name ?? $student->school->name ?? $student->school->school_name ?? 'Centre National' }}</p>
            <p class="series">{{ $student->serie->nom ?? 'GÉNÉRALE' }}</p>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p class="footer-note">
            * Présentation obligatoire d'une pièce d'identité en cours de validité.
            Tout candidat surpris en flagrant délit de fraude sera immédiatement exclu.
        </p>
        <div class="signature-box">
            <p class="signature-title">Le Directeur des Examens</p>
            <div class="signature-space"></div>
            <p class="signature-note">Signé électroniquement</p>
        </div>
    </div>
</body>
</html>