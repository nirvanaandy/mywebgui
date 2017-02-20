<?php
/* Ship CPE server side php */
require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;

$cidn = $_POST['input_cidn'];
$siteId = $_POST['input_siteid'];
$cpeName = $_POST['input_cpename'];
$payloadXml = $_POST['input_xml'];

$OPERATIONNAME = "SHIP CPE";

$logger->info($OPERATIONNAME.'BEGIN. CIDN =>'.$cidn.'  SiteId =>'.$siteId.' CPE Name => '.$cpeName);

$curl = new cURL($logger);

$shipurl = str_replace('$[1]', $cidn, SHIP_CPE_URL);
$shipurl = str_replace('$[2]', $siteId, $shipurl);
$shipurl = str_replace('$[3]', $cpeName, $shipurl);

$returnflag = $curl->onboard($shipurl,$payloadXml,"SHIP_CPE");

 //If there is an error, return error msg
 if ( $returnflag ) {
	$logger->info($OPERATIONNAME.' SUCCESS. CIDN =>'.$cidn.'  SiteId =>'.$siteId); 	
	echo $curl->taskid;
}
 else {
 	$logger->error($OPERATIONNAME.'FAILED. CIDN =>'.$cidn.'  SiteId =>'.$siteId);
 	echo 'Error: '.$OPERATIONNAME.' met error=> '.$curl->errormessage;

}
	 
?>
