<?php
require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;

$customer_xml = $_POST['customer_xml']; 
$logger->info('Onboard_Customer_CMI BEGIN.');

$curl = new cURL($logger);

$returnflag = $curl->onboard(ONBOARD_CUSTOMER_CMI_URL,$customer_xml,"ONBOARD_CUSTOMER_CMI");

 //If there is an error, return error msg
 if ( $returnflag ) {
	$logger->info('Onboard_Customer_CMI BEGIN SUCCESS. TASK-ID => '.$curl->taskid); 	
	echo $curl->taskid;
}
 else {
 	$logger->error('Onboard_Customer_CMI FAILED.');
 	echo 'Error: Onboard Customer to CMI Model met error=> '.$curl->errormessage;

}
	 
?>
