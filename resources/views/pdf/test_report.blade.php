<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport de Test AfriTest - {{ $report->application->name }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #1e293b; line-height: 1.5; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
        .title { font-size: 18px; color: #64748b; margin-top: 5px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; color: #4f46e5; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 10px; }
        .grid { display: table; width: 100%; }
        .grid-col { display: table-cell; width: 50%; vertical-align: top; }
        .label { font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: bold; }
        .value { font-size: 12px; font-weight: bold; margin-bottom: 10px; }
        .bug-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
        .bug-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .severity { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .severity-critical { background: #fee2e2; color: #991b1b; }
        .severity-high { background: #ffedd5; color: #9a3412; }
        .severity-medium { background: #fef9c3; color: #854d0e; }
        .severity-low { background: #f0fdf4; color: #166534; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        .screenshot { max-width: 100%; border-radius: 8px; margin-top: 10px; border: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">AFRITEST</div>
        <div class="title">Rapport de Test Qualité (QA)</div>
    </div>

    <div class="section">
        <div class="section-title">Informations Générales</div>
        <div class="grid">
            <div class="grid-col">
                <div class="label">Application</div>
                <div class="value">{{ $report->application->name }}</div>
                
                <div class="label">Type / Plateforme</div>
                <div class="value">{{ $report->application->type }} / {{ $report->application->platform }}</div>
            </div>
            <div class="grid-col">
                <div class="label">Testeur</div>
                <div class="value">{{ $report->tester()->name }}</div>
                
                <div class="label">Date de soumission</div>
                <div class="value">{{ $report->submitted_at->format('d/m/Y H:i') }}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Environnement de Test</div>
        <div class="grid">
            <div class="grid-col">
                <div class="label">Appareil / Modèle</div>
                <div class="value">{{ $report->device_model }}</div>
                
                <div class="label">Système d'exploitation</div>
                <div class="value">{{ $report->device_os }}</div>
            </div>
            <div class="grid-col">
                <div class="label">Navigateur / Version</div>
                <div class="value">{{ $report->browser ?? 'N/A' }}</div>
                
                <div class="label">Connectivité</div>
                <div class="value">{{ $report->connectivity ?? 'Non spécifiée' }}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Bugs Signalés ({{ count($report->bugs ?? []) }})</div>
        @foreach($report->bugs ?? [] as $bug)
            <div class="bug-card">
                <div class="bug-header">
                    <span style="font-weight: bold; font-size: 14px;">{{ $bug['title'] }}</span>
                    <span class="severity severity-{{ $bug['severity'] }}">{{ $bug['severity'] }}</span>
                </div>
                <div class="label">Étapes de reproduction</div>
                <div class="value" style="font-weight: normal;">{{ $bug['steps'] }}</div>
                
                <div class="grid">
                    <div class="grid-col">
                        <div class="label">Comportement attendu</div>
                        <div class="value" style="font-weight: normal;">{{ $bug['expected'] ?? 'N/A' }}</div>
                    </div>
                    <div class="grid-col">
                        <div class="label">Comportement observé</div>
                        <div class="value" style="font-weight: normal;">{{ $bug['actual'] ?? 'N/A' }}</div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    <div class="section">
        <div class="section-title">Checklist des fonctionnalités</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
                <tr style="background: #f8fafc;">
                    <th style="text-align: left; padding: 8px; border: 1px solid #e2e8f0;">Fonctionnalité</th>
                    <th style="text-align: center; padding: 8px; border: 1px solid #e2e8f0;">Statut</th>
                    <th style="text-align: left; padding: 8px; border: 1px solid #e2e8f0;">Notes</th>
                </tr>
            </thead>
            <tbody>
                @foreach($report->features_tested ?? [] as $feature)
                    <tr>
                        <td style="padding: 8px; border: 1px solid #e2e8f0;">{{ $feature['feature'] }}</td>
                        <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">
                            <span style="color: {{ $feature['status'] === 'pass' ? '#166534' : ($feature['status'] === 'fail' ? '#991b1b' : '#64748b') }}; font-weight: bold;">
                                {{ strtoupper($feature['status']) }}
                            </span>
                        </td>
                        <td style="padding: 8px; border: 1px solid #e2e8f0;">{{ $feature['notes'] ?? '' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Évaluation Générale</div>
        <div class="label">Notes (sur 5)</div>
        <div class="value">
            Score Global : {{ $report->rating }} / 5
        </div>
        <div class="label">Commentaires du testeur</div>
        <div class="value" style="font-weight: normal;">{{ $report->notes }}</div>
    </div>

    <div class="footer">
        Rapport généré automatiquement par la plateforme AfriTest - www.afritest.app
    </div>
</body>
</html>
