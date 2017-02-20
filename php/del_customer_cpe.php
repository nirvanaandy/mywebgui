<?php
/* Delete Customer on CPE Model server side php*/
require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;

$cidn = $_POST["input_cidn"];

$logger->info('Del_Customer_CPE BEGIN. CIDN => '.$cidn);

$curl = new cURL($logger);

$delurl = str_replace('$[1]', $cidn, DELETE_CUSTOMER_CPE_URL);

$returnflag = $curl->delete($delurl,"DELETE_CUSTOMER_ON_CPE");

 //If there is an error, return error msg
 if ( $returnflag ) {
	$logger->info('Del_Customer_CPE SUCCESS. CIDN => '.$cidn); 	
	echo $curl->taskid;
}
 else {
 	$logger->error('Del_Customer_CPE FAILED. CIDN => '.$cidn);
 	echo 'Error: Delete Customer to CPE Model met error=> '.$curl->errormessage;

}

	 
?>
