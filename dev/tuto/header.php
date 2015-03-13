<!DOCTYPE html>
<html>
    <head>
        <title>Tuto Ageval</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="../style.css"/>
        <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
        <script src="../tuto.js"></script>
    </head>
    <body>
        <header>
            <div class="tool">
                <div class="sized">
                    <a href="#">Accueil</a>
                    <a href="#">Identitié</a>
                    <a href="#" class="disco">Déconnection</a>
                </div>
            </div>
            <div class="menu sized">
                <img id="logo" alt="" src="#"/>
                <ul class="nav">
                    <li class="eval <?php if($menu==1)echo 'active' ?>">
                        <a href="../evaluation">&Eacute;valuation</a>
                    </li>
                    <li class="pa <?php if($menu==2)echo 'active' ?>">
                        <a href="../plan-action">Plan d'action</a>
                    </li>
                    <li class="indic <?php if($menu==3)echo 'active' ?>">
                        <a href="../indicateurs">Indicateur</a>
                    </li>
                    <li class="ged <?php if($menu==4)echo 'active' ?>">
                        <a href="../documents">Gestion documentaire</a>
                    </li>
                    <li class="enquete <?php if($menu==5)echo 'active' ?>">
                        <a href="../enquetes">Enquête de<br/>satisfaction</a>
                    </li>
                    <li class="ei <?php if($menu==6)echo 'active' ?>">
                        <a href="../evenements">&Eacute;vénements indésirables</a>
                    </li>
                    <li class="carto <?php if($menu==7)echo 'active' ?>">
                        <span id="hookMenu"><a href="../cartographie">Cartographie des risques</a></span>
                        
                    </li>
                </ul>
            </div>
        </header>