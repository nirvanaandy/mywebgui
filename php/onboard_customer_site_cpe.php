<?php
//Onboard Customer Site to CPE Model server side php
require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;

$customer_site_xml = $_POST['customer_site_xml']; 
$cidn = $_POST['customer_cidn'];
$logger->info('Onboard_Customer_Site_CPE BEGIN. CIDN => '.$cidn);

$curl = new cURL($logger);
$onboardurl = str_replace('$[1]',$cidn,ONBOARD_CUSTOMER_SITE_CPE_URL);


$returnflag = $curl->onboard($onboardurl,$customer_site_xml,"ONBOARD_CUSTOMER_SITE_CPE");

 //If there is an error, return error msg
 if ( $returnflag ) {
	$logger->info('Onboard_Customer_Site_CPE SUCCESS. . CIDN => '.$cidn); 	
	echo $curl->taskid;
}
 else {
 	$logger->error('Onboard_Customer_Site_CPE FAILED. CIDN => '.$cidn);
 	echo 'Error: Onboard Customer Site to CPE Model met error=> '.$curl->errormessage;

}
	 
?>
