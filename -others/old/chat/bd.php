<?php

if(isset($_POST['act'])){
	if($_POST['act'] === "refresh"){
		echo refresh($_POST['last']);
	}
	else if($_POST['act'] === "addmess"){
		addMess($_POST['pseudo'], $_POST['mess']);
	}
	
	connecte($_POST['connecte'] === "true", $_POST['pseudo']);
}

function getPdo(){
	$link = mysql_connect('guillaume.martigny.sql.free.fr', 'guillaume.martigny', '11235812');
	mysql_select_db("guillaume_martigny",$link);
	mysql_query("SET NAMES 'utf8'");
	return true;
	
	// return new PDO("mysql:host=sql.free.fr;", "guillaume.martigny", "11235812");
}

function getMess(){
	$pdo = getPdo();
	
	$query = "SELECT * FROM messages WHERE 1 ORDER BY num";
	
	/* $res = $pdo->query($query);
	$res->fetchAll();
	
	if(count($res) > 0){
		return $res
	}*/
	
	$res = mysql_query($query);
	if (mysql_num_rows($res) != 0) {
		$resultArray = array();
		while ($row = mysql_fetch_assoc($res)) {
		   array_push($resultArray, array("num"=>$row["num"], "pseudo"=>$row["pseudo"], "mess"=>$row["message"]));
		}
		return $resultArray;
	}
	
}

function refresh($last){
	$pdo = getPdo();
	
	$query = "SELECT * FROM messages WHERE num > $last ORDER BY num";
	
	/* $res = $pdo->query("SELECT * FROM messages WHERE num > $last");
	$res = $res->fetchAll();
	
	if(count($res) > 0){
		return json_encode($res);
	}
	else{
		return "no";
	}*/
	
	$res = mysql_query($query);
	if (mysql_num_rows($res) != 0) {
		while(($resultArray[] = mysql_fetch_assoc($res)) || array_pop($resultArray));
		//print_r($resultArray);
		return my_json_encode($resultArray);
	}
	else{
		echo "no";
	}
}

function getLast(){
	$pdo = getPdo();
	
	$query = "SELECT MAX(num) as max FROM messages WHERE 1";
	
	/* $res = $pdo->query($query);
	$res = $res->fetchAll();
	
	if(count($res) > 0){
		return $res[0]['max'];
	}
	else{
		return "no";
	}*/
	
	$res = mysql_query($query);
	if (mysql_num_rows($res) != 0) {
		$tmp = mysql_fetch_assoc($res);
		return $tmp['max'];
	}
	else{
		return 0;
	}
}

function addMess($pseudo, $mess){
	$pdo = getPdo();
	
	/* $query =	"set @tmp = (SELECT MAX(num)+1 FROM messages WHERE 1); ".
				"INSERT INTO messages (`num`, `pseudo` ,`message`) VALUES (@tmp, '$pseudo', '$mess')";
	$query = $pdo->prepare($query);
	$query->execute();
	
	$res = getMess();
	if(count($res) > 100){
		$query = $pdo->prepare("DELETE FROM `messages` WHERE 1 LIMIT 1");
		$query->execute();
	}*/
	
	$tmp = getLast() + 1;
	//if($tmp > 100){
		$query = "INSERT INTO messages (`num`, `pseudo` ,`message`) VALUES ($tmp, '$pseudo', '$mess')";
	/*}
	else{
		$tmp %= 100;
		$query = "UPDATE messages SET pseudo = '$pseudo', mess = '$mess' WHERE num = $tmp LIMIT 1 ;";
	}*/
	$res = mysql_query($query);
	
	echo $mess;
	
	$res = getMess();
	if (count($res) > 100) {
		$query = "DELETE FROM `messages` WHERE 1 ORDER BY num LIMIT 1";
		$res = mysql_query($query);
	}
}

function connecte($really, $pseudo){
	$pdo = getPdo();
	
	if($really){
		$query = "INSERT INTO connecte(`pseudo`) VALUES ('$pseudo')";
	}
	else{
		$query = "DELETE FROM connecte WHERE pseudo = '$pseudo' LIMIT 1";
	}
	$res = mysql_query($query);
}

function my_escape($str){
	return addcslashes($str, "\t\n\"\\/");
}
function my_json_encode($in) {

  $out = "";
  if (is_object($in)) {
    /*$class_vars = get_object_vars(($in));
    $arr = array();
    foreach ($class_vars as $key => $val) {
      $arr[$key] = "\"".my_escape($key)."\":\"{$val}\"";
    }
    $val = implode(',', $arr);
    $out .= "{$val}";*/
  }elseif (is_array($in)) {
    $obj = false;
    $arr = array();
    foreach($in AS $key => $val) {
      if(!is_numeric($key)) {
        $obj = true;
      }
      $arr[$key] = my_json_encode($val);
    }
    if($obj) {
      foreach($arr AS $key => $val) {
        $arr[$key] = "\"".my_escape($key)."\":$val";
      }
      $val = implode(',', $arr);
      $out .= "{$val}";
    }else {
      $val = implode(',', $arr);
      $out .= "[{ $val }]";
    }
  }elseif (is_bool($in)) {
    $out .= $in ? 'true' : 'false';
  }elseif (is_null($in)) {
    $out .= 'null';
  }elseif (is_string($in)) {
    $out .= "\"".my_escape($in)."\"";
  }else {
    $out .= $in;
  }
  return "{$out}"; 
}
?>