<?php
/* Get existing CPE on Customer Sites server side php */
require_once '../conf/config.php';
require_once './curlclass.php';

if ( isset($_POST["input_cidn"]) && !empty($_POST["input_cidn"]))
	$cidn = $_POST["input_cidn"];
else {
	echo 'Error: Get CPEs on Customer Site met error => Cannot get CIDN from POST. Please try again.';
	return; 
}

if ( isset($_POST["input_siteid"]) && !empty($_POST["input_siteid"]))
	$siteId = $_POST["input_siteid"];
else {
	echo 'Error: Get CPEs on Customer Site met error => Cannot get SiteId from POST. Please try again.';
	return; 
}

global $logger;

$logger->info('View Existing CPEs on Customer Site, BEGIN. CIDN =>'.$cidn." SiteId => ".$siteId );

$curl = new cURL($logger);

$geturl = str_replace('$[1]', $cidn, GET_CPE_CUSTOMER_SITE_URL);
$geturl = str_replace('$[2]', $siteId,$geturl);

$xmlstr = $curl->get_general($geturl, "GET_CPE_CUSTOMER_SITE");


$logger->info('View Existing CPEs on Customer Site, SUCCESS. CIDN =>'.$cidn." SiteId => ".$siteId );
echo $xmlstr;

?>
