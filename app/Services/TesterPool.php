<?php

namespace App\Services;

use App\Models\User;

class TesterPool
{
    /**
     * Liste historique des emails collectés avant la plateforme.
     */
    public static array $legacyEmails = [
        'ouateedemloic@gmail.com', 'leecooper8515@gmail.com', 'vidojishu@gmail.com', 'danklougod5@gmail.com', 
        'devwithnikolai@gmail.com', 'silvaaze10@gmail.com', 'eyikeolivier@gmail.com', 'lenyxdev@gmail.com', 
        'osaadoukou@gmail.com', 'obamjunior83@gmail.com', 'lebonadjanohoun7@gmail.com', 'yvesmaillore@gmail.com', 
        'lnhm87404@gmail.com', 'nkamiloic237@gmail.com', 'dossouyovogaitan6@gmail.com', 'tchinguiloumanzama@gmail.com', 
        'supermarketgroupe@gmail.com', 'azebazeulrich81@gmail.com', 'gerardpoukpezi22@gmail.com', 
        'oumarousamailaabdourahaman@gmail.com', 'doviange@gmail.com', 'djibrilabdelsamed8@gmail.com', 
        'berlisbiyaou@gmail.com', 'josiaskoutch@gmail.com', 'aimeeebakisse69@gmail.com', 'francktouko04@gmail.com', 
        'abdoulayeabbaboukar@gmail.com', 'mr.laurenzoo123@gmail.com', 'kmer237code@gmail.com', 'jefvous@gmail.com', 
        'traore_farid@yahoo.fr', 'manuelchoupe@gmail.com', 'ekorogaetan5@gmail.com', 'mohamedamadou79@gmail.com', 
        'levisscat@gmail.com', 'contactdominique70@gmail.com', 'tenimkoc@gmail.com', 'essomanam23@gmail.com', 
        'controlleroot@gmail.com', 'yvesmike9@gmail.com', 'emiliodeniclo71@gmail.com', 'angedilane05@gmail.com', 
        'taptuedilane@gmail.com', 'uukiah90@gmail.com', 'erictchandao6@gmail.com', 'andemabobo@gmail.com', 
        'aboubacarkone1250@Gmail.com', 'aubreylincoln100110@gmail.com', 'sawadogoabdoulmohaimine12345@gmail.com', 
        'olahodonou@gmail.com', 'Junnyjoe5@gmail.com', 'nourdevtd@gmail.com', 'Andybishimba10@gmail.com', 
        'cyrkaba@gmail.com', 'stanismiafo348@gmail.com', 'aaronfossi3@gmail.com', 'hmidev19@gmail.com', 
        'stevejerkey@gmail.com', 'tovissanousabine@gmail.com', 'frankmarcel175@gmail.com', 'ydoraservices@gmail.com', 
        'testeurdappcmr@gmail.com', 'samtompkins1702@gmail.com', 'melodybliss03@gmail.com', 'anniemasso07@gmail.com', 
        'sawadogoeddie05@gmail.com', 'nojaaime@gmail.com', 'jiordikengne@gmail.com', 'keampir@gmail.com'
    ];

    /**
     * Récupère un pool d'emails mélangeant les inscrits (les plus actifs d'abord) et la liste historique.
     */
    public static function getRandomEmails(int $count): string
    {
        // 1. Récupérer les testeurs les plus actifs (ceux qui ont déjà de l'expérience)
        // On prend un échantillon des meilleurs pour garder un aspect aléatoire mais qualitatif
        $dbEmails = User::where('is_admin', false)
            ->orderBy('score_tester', 'desc')
            ->limit($count * 3) // On prend un pool de 3x la taille requise parmi les meilleurs
            ->pluck('email')
            ->toArray();

        // 2. Fusionner avec la liste historique (fallback)
        $fullPool = array_unique(array_merge($dbEmails, self::$legacyEmails));

        // 3. Mélanger pour que ce ne soit pas toujours exactement les mêmes 14
        shuffle($fullPool);
        
        // 4. Sélectionner exactement le nombre requis
        $selected = array_slice($fullPool, 0, min($count, count($fullPool)));
        
        return implode(', ', $selected);
    }
}
