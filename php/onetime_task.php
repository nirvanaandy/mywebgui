<?php
/* Onetime Task Execution server side php */
require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;
global $CONFIG;

$operationName = $_POST['input_operation'];
$xmlContent = $_POST['input_xml'];

$logger->info('ONETIME TASK BEGIN. Operation =>'.$operationName);

$curl = new cURL($logger);

$apiurl = $CONFIG[$operationName.'_URL'];

$returnflag = $curl->onboard($apiurl,$xmlContent,$operationName);

 //If there is an error, return error msg
 if ( $returnflag ) {
	$logger->info('ONETIME TASK SUCCESS. Operation =>'.$operationName); 	
	echo $curl->taskid;
}
 else {
 	$logger->error('ONETIME TASK FAILED. Operation =>'. $operationName);
 	echo 'Error: ONETIME TASK met error=> '.$curl->errormessage;

}
	 
?>
