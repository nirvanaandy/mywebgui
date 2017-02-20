<?php
/* Get existing Customer Sites on CPE server side php */
require_once '../conf/config.php';
require_once './curlclass.php';

$cidn = $_POST['cidn'];

global $logger;

$logger->info('View Existing Customer Site on CPE, BEGIN.');

$curl = new cURL($logger);

$geturl = str_replace('$[1]', $cidn, GET_CUSTOMER_SITE_CPE_URL);

$xmlstr = $curl->get_general($geturl, "GET_CUSTOMER_SITE_CPE");


$logger->info('View Existing Customer Site on CPE, SUCCESS.'); 	
echo $xmlstr;

?>
