<!DOCTYPE HTML>
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
<style>
	th, td{
		padding : 2px 5px;
	}
	th{
		background : lightgrey;
	}
	
	#data{
		border-collapse : collapse;
		width : 800px;
	}
	#titre{ width : 55%; }
	#genre{ width : 20%; }
	#version{ width : 5%; }
	#annee{ width : 10%; }
	#duree{ width : 10%; }
	
	tr{
		background : #B5F0FF;
	}
	
	tbody tr:nth-child(even){
		background : #FFFFB5;
	}
	
	#gototop{
		position : fixed;
		bottom : 30px;
		right : 200px;
		cursor : pointer;
		color : blue;
	}
	#gototop:hover{
		text-decoration : underline;
	}
	
	#new{
		position : fixed;
		top : 20px;
		left : 900px;
	}
	
	.sortable{
		cursor : pointer;
	}
	.sortable:hover{
		color : red;
	}
</style>
</head>
<body>
	recherche : <input type="text" id="search" onkeyup="search(this.value, ind)"/> par
	<select onchange="ind = this.selectedIndex">
		<option selected="selected">Titre</option>
		<option>Genre</option>
		<option>Version</option>
		<option>Année</option>
	</select>
	<table id="data">
		<thead>
			<th id="titre">Titre</th>
			<th id="genre">
				<select onchange="search(this.options[this.selectedIndex].value, 1)">
					<option value="." selected="selected">Genre</option>
					<option value="action">- Action</option>
					<option value="aventure">- Aventure</option>
					<option value="animation">- Animation</option>
					<option value="comédie">- Commédie</option>
					<option value="drame">- Drame</option>
					<option value="japonais">- Jap'</option>
					<option value="policier">- Policier</option>
					<option value="science">- Sci-Fi</option>
					<option value="show">- Show</option>
					<option value="autre">- Autres</option>
				</select>
			</th>
			<th id="version">
				<select onchange="search(this.options[this.selectedIndex].value, 2)">
					<option value=".">Version</option>
					<option value="vf">- VF</option>
					<option value="vostfr">- VOSTFR</option>
				</select>
			</th>
			<th id="annee" class="sortable">Année</th>
			<th id="duree" class="sortable">Durée</th>
		</thead>
		<?php
			$link = mysql_connect('little.guigui.sql.free.fr', 'little.guigui', '11235812');
			mysql_select_db("little_guigui",$link);
			mysql_query("SET NAMES 'utf8'");
			
			$query = "SELECT * FROM films WHERE 1 ORDER BY titre";
			$res = mysql_query($query);
			while ($row = mysql_fetch_array($res, MYSQL_NUM)) {
				echo "<tr>\n";
				printf("<td title='%s'>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td>\n", htmlspecialchars($row[5], ENT_QUOTES), $row[0], $row[1], $row[2], $row[3], $row[4]);
				echo "</tr>\n";
			}
		?>
	</table>
	<div id="gototop">
		<span class="a" onclick="gototop();">Retour en haut</a>
	</div>
	<div id="new">
		<h3>Ajouter un film</h3>
		<form onsubmit="return false" action="#">
			<table>
				<tr>
					<td><label for="newTitre">Titre</label> :</td>
					<td><input type="text" id="newTitre"/></td>
				</tr>
				<tr>
					<td><label for="newGenre">Genre</label> :</td>
					<td>
						<select id="newGenre">
							<option value="action">- Action</option>
							<option value="aventure">- Aventure</option>
							<option value="animation">- Animation</option>
							<option value="comédie">- Commédie</option>
							<option value="drame">- Drame</option>
							<option value="japonais">- Jap'</option>
							<option value="policier">- Policier</option>
							<option value="science">- Sci-Fi</option>
							<option value="show">- Show</option>
							<option value="autre">- Autres</option>
						</select>
					</td>
				</tr>
				<tr>
					<td><label for="newVersion">Version</label></td>
					<td>
						<select id="newVersion">
							<option value="vf">- VF</option>
							<option value="vostfr">- VOSTFR</option>
						</select>
					</td>
				</tr>
				<tr>
					<td><label for="newAnnee">Année</label></td>
					<td><input type="text" id="newAnnee" maxlength="4" size="4"/></td>
				</tr>
				<tr>
					<td><label for="newDuree">Durée</label></td>
					<td><input type="text" id="newDuree"/></td>
				</tr>
				<tr>
					<td><label for="newDesc">Description</label></td>
					<td><textarea id="newDesc" onkeyup="countLeft(this.textLength)"></textarea><br/>
					<span id="countLeft">300</span></td>
				</tr>
			</table>
		</form>
	</div>
</body>
<script>
var ind = 0;

function search(entry, col){
	var regs = entry.replace(/\s+/g, " ").replace(/(^\s|\s$)/g, "").split(" ");
	for(var i=0;i<regs.length;++i){
		regs[i] = new RegExp(regs[i], "gi");
	}
	
	var rows = document.getElementById("data").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
	for(var i=0;i<rows.length;++i){
		var title = rows[i].children[col].innerHTML;
		var fit = true;
		for(var j=0;j<regs.length;++j){
			fit = fit && regs[j].test(title);
			regs[j].lastIndex = 0;
		}
		if(fit){
			rows[i].style.display = "";
		}
		else{
			rows[i].style.display = "none";
		}
	}
}

var goto_timeout = null;
function gototop(){
	window.scroll(0, window.scrollY - Math.max(window.scrollY/30, 7));
	if(window.scrollY > 0){
		goto_timeout = setTimeout(gototop, 15);
	}
}

function countLeft(len){
	document.getElementById("countLeft").innerHTML = 300 - len;
}
</script>