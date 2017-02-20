<!DOCTYPE html>

<html>
<head>
        <title>CMI Web GUI</title>
<script type="text/javascript" src="js/cmiwebgui-common.js"></script>
<link rel="stylesheet" type="text/css" href="css/cmiwebgui-common.css" />

<nav class="navbar navbar-default" id="navigatebar">
</nav>
<script type="text/javascript">genNavigateBar();</script>


</head>
<body>
<?php 

function xmlcode($tag) {
  $tag = str_replace("&", "&amp;", $tag);
  $tag = str_replace("<", "&lt;", $tag);
  $tag = str_replace(">", "&gt;", $tag);
  $tag = str_replace("'", "&apos;", $tag);
  $tag = str_replace("\"", '&quot;', $tag);
  return $tag;
}

	$logDir = '/var/www/html/logs/';
  $today = date("Y-m-d");
	$logFile = $logDir.'log_'.$today.'.txt';
	$lastModifiedTime = filectime($logFile);

	//Html: Show the last modified time
	echo '<hr/>';
	echo "$logFile - Last Modified: " . @date('Y-m-d H:i:s',$lastModifiedTime);
	echo '<hr/>';
    
    $contents = array();
    $contents = @file($logFile);
    if ($contents === false) {
      $contents[] = "<font color=red><br/>ERROR: Could not access $filename<br/><br/></font>";
    } 
    echo '<pre style="background-color:black; color:white; white-space: pre-wrap; word-wrap: break-word; overflow: auto" width="132">';
    // Colorize lines
    $length = count($contents);
    $started = false;
    foreach ($contents as $lineIdx => $line) {
      if (($lineIdx + 1 < $length) &&
          ($contents[$lineIdx+1][0] == '*') &&
          ($contents[$lineIdx+1][2] == ' ')) {
          switch($contents[$lineIdx+1][1]) {
            case 'C':
              echo '<font color=red>';
              break; 
            case '*':
              echo '<font color=orange>';
              break; 
            case ' ':
            default:
              echo '<font color=yellow>';
              break; 
          }
        $started = true;
      }
      echo xmlcode($line);  
      if ((true === $started) &&
          (strpos($contents[$lineIdx],'++-'))) {
        echo '</font>'; 
        $started = false;
      }
    }
    echo '</pre>';

?>

</body>
</html>
