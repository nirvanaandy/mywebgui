<?php
/* Create Firewall Context server side php */
require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;


$OPERATION_NAME = "CREATE FIREWALL CONTEXT ";

if ( isset($_POST["input_primary_asa_ip"]) && !empty($_POST["input_primary_asa_ip"]))
	$primaryAsaIP = $_POST["input_primary_asa_ip"];
else {
	echo 'Error: '.$OPERATION_NAME.' met error => Cannot get Primary asa IP from POST. Please try again.';
	return; 
}

if ( isset($_POST["input_context_xml"]) && !empty($_POST["input_context_xml"]))
	$contextXML = $_POST["input_context_xml"];
else {
	echo 'Error: '.$OPERATION_NAME.' met error => Cannot get Context XML from POST. Please try again.';
	return; 
}


$logger->info($OPERATION_NAME.'BEGIN. Primary asa IP =>'.$primaryAsaIP);

$curl = new cURL($logger);

$apiurl = str_replace('$[1]', $primaryAsaIP, CREATE_FIREWALL_CONTEXT_URL);

$returnflag = $curl->onboard($apiurl,$contextXML,$OPERATION_NAME);

 //If there is an error, return error msg
 if ( $returnflag ) {
	$logger->info($OPERATION_NAME.'SUCCESS. Primary asa IP =>'.$primaryAsaIP); 	
	echo $curl->taskid;
}
 else {
 	$logger->error($OPERATION_NAME.'FAILED. Primary asa IP =>'.$primaryAsaIP);
 	echo 'Error: '.$OPERATION_NAME.' met error=> '.$curl->errormessage;

}
	 
?>
