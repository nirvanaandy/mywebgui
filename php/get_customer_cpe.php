<?php
require_once '../conf/config.php';
require_once './curlclass.php';
	global $logger;

	$logger->info('View Existing Customer on CPE, BEGIN.');

	$curl = new cURL($logger);

	$xmlstr = $curl->get_general(GET_CUSTOMER_CPE_URL, "GET_CUSTOMER_CPE");


	$logger->info('View Existing Customer on CPE, SUCCESS.'); 	
	echo $xmlstr;

?>
