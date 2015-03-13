<?php
    
    $menu = 1;
    include_once '../header.php';
    
?>

<div class="sous-menu sized eval">
    <ul class="nav">
        <li><a href="#">Mes évaluations</a></li>
        <li><a href="#">Rapports</a></li>
        <li><a href="#">Résultats</a></li>
        <li><a href="#">&Eacute;léments de preuves</a></li>
    </ul>
</div>
<div class="sized" id="content">
    <h1><span id="hookV5">&Eacute;valuation</span></h1>
</div>

<script>
    $(function(){
        $.tutorize([{
            hook: "hookV5",
            title: "Bienvenue dans cette nouvelle version",
            content: "Vous allez découvrir toutes les nouveautées que nous vous avons préparées"
        },
        {
            hook: "hookMenu",
            title: "Apparence",
            content: "Déjà le menu a pas mal changé et ça claque !"
        }]);
    });
</script>

<?php
    include_once '../footer.html';