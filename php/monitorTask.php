<?php

require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;

$task_id = $_POST['task_id']; 
$logger->info('Monitor Task Basic: BEGIN TASKID => '.$task_id);
$curl = new cURL($logger);
$result = $curl->monitor_task_basic($task_id);

echo $result;
$logger->info('Monitor Task Basic: END TASKID => '.$task_id);


?>


