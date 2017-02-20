<?php
require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;

$customer_xml = $_POST['customer_xml']; 
$logger->info('Onboard_Customer_CPE BEGIN.');

$curl = new cURL($logger);

$returnflag = $curl->onboard(ONBOARD_CUSTOMER_CPE_URL,$customer_xml,"ONBOARD_CUSTOMER_CPE");

 //If there is an error, return error msg
 if ( $returnflag ) {
	$logger->info('Onboard_Customer_CPE SUCCESS.'); 	
	echo $curl->taskid;
}
 else {
 	$logger->error('Onboard_Customer_CPE FAILED.');
 	echo 'Error: Onboard Customer to CPE Model met error=> '.$curl->errormessage;

}
	 
?>
