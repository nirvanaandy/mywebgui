<?php
/* Onboard CPE to Customer Sites server side php */
require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;

$cidn = $_POST['customer_cidn'];
$siteId = $_POST['site_id'];
$cpe_xml = $_POST['cpe_xml'];

$logger->info('Onboard_CPE_Customer_Site BEGIN. CIDN =>'.$cidn.'  SiteId =>'.$siteId);

$curl = new cURL($logger);

$onboardurl = str_replace('$[1]', $cidn, ONBOARD_CPE_CUSTOMER_SITE_URL);
$onboardurl = str_replace('$[2]', $siteId, $onboardurl);

$returnflag = $curl->onboard($onboardurl,$cpe_xml,"ONBOARD_CPE_CUSTOMER_SITE");

 //If there is an error, return error msg
 if ( $returnflag ) {
	$logger->info('Onboard_CPE_Customer_Site SUCCESS. CIDN =>'.$cidn.'  SiteId =>'.$siteId); 	
	echo $curl->taskid;
}
 else {
 	$logger->error('Onboard_CPE_Customer_Site FAILED. CIDN =>'.$cidn.'  SiteId =>'.$siteId);
 	echo 'Error: Onboard CPE to Customer Site met error=> '.$curl->errormessage;

}
	 
?>
