<?php

function connection(){
	$link = mysql_connect('guillaume.martigny.sql.free.fr', 'guillaume.martigny', '11235812');
	mysql_select_db("guillaume_martigny",$link);
	mysql_query("SET NAMES 'utf8'");
	return true;
	
	// return new PDO("mysql:host=sql.free.fr;", "guillaume.martigny", "11235812");
}

function getPos($me){
	connection();
	
	$query = "SELECT * FROM joueurs WHERE pseudo != $me ORDER BY pseudo";
	
	$res = mysql_query($query);
	if (mysql_num_rows($res) != 0){
		$resultArray = array();
		while ($row = mysql_fetch_assoc($res)) {
		   array_push($resultArray, array("num"=>$row["num"], "pseudo"=>$row["pseudo"], "mess"=>$row["message"]));
		}
		return my_json_encode($resultArray);
	}
	else{
		return "oups";
	}
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