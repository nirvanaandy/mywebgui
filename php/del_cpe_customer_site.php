<?php
/* Delete CPEs on Customer Site server side php*/
require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;

if ( isset($_POST["input_cidn"]) && !empty($_POST["input_cidn"]))
	$cidn = $_POST["input_cidn"];
else {
	echo 'Error: Delete CPE on Customer Site met error => Cannot get CIDN from POST. Please try again.';
	return; 
}

if ( isset($_POST["input_siteid"]) && !empty($_POST["input_siteid"]))
	$siteId = $_POST["input_siteid"];
else {
	echo 'Error: Delete CPE on Customer Site met error => Cannot get SiteId from POST. Please try again.';
	return; 
}

if ( isset($_POST["input_cpename"]) && !empty($_POST["input_cpename"]))
	$cpeName = $_POST["input_siteid"];
else {
	echo 'Error: Delete CPE on Customer Site met error => Cannot get CPE Name from POST. Please try again.';
	return; 
}

$logger->info('Del_CPE_Customer_Site BEGIN. CIDN => '.$cidn.' SiteId => '.$siteId.' CPE => '.$cpeName);

$curl = new cURL($logger);

$delurl = str_replace('$[1]', $cidn, DELETE_CPE_CUSTOMER_SITE_URL);
$delurl = str_replace('$[2]', $siteId, $delurl);

$returnflag = $curl->delete($delurl,"DELETE_CPE_ON_CUSTOMER_SITE");

 //If there is an error, return error msg
 if ( $returnflag ) {
	$logger->info('Del_CPE_Customer_Site SUCCESS. CIDN => '.$cidn .' SiteId => '.$siteId.' CPE => '.$cpeName); 	
	echo $curl->taskid;
}
 else {
 	$logger->error('Del_CPE_Customer_Site FAILED. CIDN => '.$cidn.' SiteId => '.$siteId.' CPE => '.$cpeName);
 	echo 'Error: Delete CPE on Customer Site met error => '.$curl->errormessage;

}

	 
?>
