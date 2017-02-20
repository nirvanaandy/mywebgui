<?php
/* Get existing Customers on CMI Model server side php */
require_once '../conf/config.php';
require_once './curlclass.php';
	
global $logger;

$logger->info('View Existing Customer on CMI, BEGIN.');

$curl = new cURL($logger);

$xmlstr = $curl->get_general(GET_CUSTOMER_CMI_URL, "GET_CUSTOMER_CMI");


$logger->info('View Existing Customer on CMI, SUCCESS.'); 	
echo $xmlstr;	 

?>
