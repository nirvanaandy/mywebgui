<?php
/* Delete Customer Site on CPE Model server side php*/
require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;

if ( isset($_POST["input_cidn"]) && !empty($_POST["input_cidn"]))
	$cidn = $_POST["input_cidn"];
else {
	echo 'Error: Delete Customer Site on CPE Model met error => Cannot get CIDN from POST. Please try again.';
	return; 
}

if ( isset($_POST["input_siteid"]) && !empty($_POST["input_siteid"]))
	$siteId = $_POST["input_siteid"];
else {
	echo 'Error: Delete Customer Site on CPE Model met error => Cannot get SiteId from POST. Please try again.';
	return; 
}


$logger->info('Del_Customer_Site_CPE BEGIN. CIDN => '.$cidn.' SiteId => '.$siteId);

$curl = new cURL($logger);

$delurl = str_replace('$[1]', $cidn, DELETE_CUSTOMER_SITE_CPE_URL);
$delurl = str_replace('$[2]', $siteId, $delurl);

$returnflag = $curl->delete($delurl,"DELETE_CUSTOMER_SITE_ON_CPE");

 //If there is an error, return error msg
 if ( $returnflag ) {
	$logger->info('Del_Customer_Site_CPE SUCCESS. CIDN => '.$cidn .' SiteId => '.$siteId); 	
	echo $curl->taskid;
}
 else {
 	$logger->error('Del_Customer_Site_CPE FAILED. CIDN => '.$cidn.' SiteId => '.$siteId);
 	echo 'Error: Delete Customer Site on CPE Model met error => '.$curl->errormessage;

}

	 
?>
