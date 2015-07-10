<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>MystR</title>
    <link type="text/css" href="style.css" rel="stylesheet"/>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <script language="javascript" type="text/javascript">
        var alea = 0;
        var lvl = 0;
        var score = 0;

        function startgame(selectlvl){ // démarrage
            lvl = selectlvl;
            if(lvl != 0){
                netoyer(); // remise a 0 pour plus de sécurité
                document.getElementById("lvl").setAttribute("disabled", ""); // disabled les lvl
                document.getElementById("game").style.display = "block";  // affichage du jeu
            }
        }

        function netoyer(){ // fonction de reset
            document.getElementById("mystr").type = "password"; // recache le nombre
            document.getElementById("essai").value = "votre essai"; // remet le message
            document.getElementById("result").value = ""; // efface le resultat
            score = 0; // mise du score à 0
            document.getElementById("score").innerHTML = score; // affichage du score 0
            alea = getRand(Math.pow(10, lvl)); // tirage du nombre
            document.getElementById("mystr").value = alea; // ""affichage" du nombre aleatoir
            document.getElementById("bouton").value = "OK"; // met bien le bouton a OK
            document.getElementById("bouton").removeAttribute("onclick");
            document.getElementById("bouton").setAttribute("onclick", "test();"); // remet le onclick a test()
            document.getElementById("min").innerHTML = 1;
            document.getElementById("max").innerHTML = Math.pow(10, lvl);
        }

        function getRand(max){
            return Math.round(Math.random()*max);
        }

        function ferme(){ // action pour fermer le jeu
            document.getElementById("game").style.display = "none" // cache le jeu
            document.getElementById("lvl").removeAttribute("disabled"); // enable la difficulté
            document.getElementById("lvl").selectedIndex = 0; // retourne la difficulté à 0
            netoyer();
        }

        function test(){ // vérification du numéro envoyer par le joueur
            score++;
            document.getElementById("score").innerHTML = score;
            var mess = "";
            var val = document.getElementById("essai").value.valueOf();
            if(isNaN(val)){
                alert("ce n'est pas un nombre.");
                mess = "essai encore"
            }
            else{
                if(val == alea){
                    mess = "Well Done !!"
                    document.getElementById("mystr").type = "text";
                    saveScore(score);
                    document.getElementById("bouton").value = "restart ?";
                    document.getElementById("bouton").removeAttribute("onclick");
                    document.getElementById("bouton").setAttribute("onclick", "netoyer();");
                }
                else{
                    if(val < alea){
                        mess = "plus grand";
                        if(document.getElementById("min").innerHTML < val){
                            document.getElementById("min").innerHTML = val;
                        }
                    }
                    else{
                        mess = "plus petit";
                        if(document.getElementById("max").innerHTML-0 > val-0){
                            document.getElementById("max").innerHTML = val;
                        }
                    }
                }
            }
            document.getElementById("result").value = mess; // affichage du resultat
        }

        function saveScore(newRecord){ // vérification et et enregistrement du score
            var record = getCook("score"+lvl);
            if(record>newRecord || record == ""){
                setCook("score"+lvl,newRecord);
                document.getElementById("score"+lvl).innerHTML = newRecord;
            }
        }

        function setCook(nom,valeur){
            document.cookie = nom + "=" + escape(valeur)
        }

        function getCook(nom){
            deb = document.cookie.indexOf(nom + "=");
            if (deb >= 0){
                deb += nom.length + 1;
                fin = document.cookie.indexOf(";",deb);
                if (fin < 0) fin = document.cookie.length
                    return unescape(document.cookie.substring(deb,fin));
                }
            return "";
        }

        function resetScore(){ // efface tous les cookies
            for(i=1;i<4;i++){
                delCook("score"+i);
                document.getElementById("score"+i).innerHTML = "";
            }
        }

        function delCook(nom){
            var veille = new Date()
            veille.setTime(veille.getTime() + (-1 * 24 * 3600 * 1000))
            document.cookie = nom + "=25;expires="+veille;
        }

        function switchCredit(){ // affiche/cache la partie credits
            if(document.getElementById('credit').style.display == 'block'){
                document.getElementById('credit').style.display = 'none';
            }
            else{
                document.getElementById('credit').style.display = 'block';
            }
        }
    </script>
  </head>
  <body>
      <div id="menu">
          <table>
              <tr>
                  <td>
                      Select difficulty :
                  </td>
                  <td>
                      <select id="lvl" onchange="startgame(this.selectedIndex)">
                          <option value="0">
                              Begin the Game !
                          </option>
                          <option value="1">
                              n00b (1-10)
                          </option>
                          <option value="2">
                              g33k (1-100)
                          </option>
                          <option value="3">
                              n3rd (1-1000)
                          </option>
                      </select>
                  </td>
                  <td rowspan="3">
                      Hall Of Fame :<br/>
                      <input type="button" value="reset score" onclick="resetScore()"
                  </td>
                  <td>
                      - n00b : <span id="score1">
					  <?php if(isset($_COOKIE['score1'])){
                          echo($_COOKIE['score1']);
                      }
                      ?>
					  </span>
                  </td>
                  <td rowspan="3" id="spacer"></td>
              </tr>
              <tr>
                  <td rowspan="2" colspan="2"></td>
                  <td>
                      - g33k : <span id="score2">
					  <?php if(isset($_COOKIE['score2'])){
                          echo($_COOKIE['score2']);
                      }
                      ?>
					  </span>
                  </td>
              </tr>
              <tr>
                  <td>
                      - n3rd : <span id="score3">
					  <?php if(isset($_COOKIE['score3'])){
                          echo($_COOKIE['score3']);
                      }
                      ?>
					  </span>
                  </td>
                  <td>
                      <a onclick="switchCredit();" title="Les crédits">~Crédits !~</a>
                  </td>
              </tr>
          </table>
      </div>

      <div id="game" style="display: none;">
          <table>
              <tr>
                  <td>
                      Le nombre MystR :
                  </td>
                  <td></td>
                  <td>
                      <input type="button" value="X" onclick="ferme();"/>
                  </td>
                  <td rowspan="2"></td>
              </tr>
              <tr>
                  <td>
                      <input id="mystr" type="password" disabled="" value="" size="3"/>
                  </td>
                  <td>
                      <input id="essai" type="text" value="votre essai" size="9" onfocus="if(this.value == 'votre essai'){this.value = ''}"/>
                  </td>
                  <td>
                      <input id="bouton" type="button" value="OK" onclick="test()"/>
                  </td>
              </tr>
              <tr>
                  <td>
                      essai : <span id="score">0</span>
                  </td>
                  <td colspan="2">
                      <input id="result" type="text" value="" disabled/>
                  </td>
                  <td>
                      de <span id="min"></span> à <span id="max"></span>
                  </td>
              </tr>
          </table>
      </div>
      <div id="credit" style="display: none;">
          <ul>
              <li>programmation : Alte</li>
              <li>beta-testeur : Amras</li>
              <li>soutiens : Mzelle</li>
          </ul>
      </div>
  </body>
</html>
