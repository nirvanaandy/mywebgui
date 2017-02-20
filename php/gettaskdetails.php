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

require_once './curlclass.php';

global $logger;

$task_id = $_GET['task_id']; 
$logger->info('Monitor Task Detail: BEGIN TASKID => '.$task_id);
$curl = new cURL($logger);
$result = $curl->monitor_task_detail($task_id);

$logger->info('Monitor Task Detail: END TASKID => '.$task_id);
    
    echo '<pre style="background-color:black; color:white; white-space: pre-wrap; word-wrap: break-word; overflow: auto" width="132">';
      echo xmlcode($result);
    echo '</pre>';

?>

</body>
</html>
