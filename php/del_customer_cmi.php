<?php
/* Delete Customer on CMI Model server side php */
require_once '../conf/config.php';
require_once './curlclass.php';

global $logger;

$cidn = $_POST["input_cidn"];

$logger->info('Del_Customer_CMI BEGIN. CIDN => '.$cidn);

$curl = new cURL($logger);

$delurl = str_replace('$[1]', $cidn, DELETE_CUSTOMER_CMI_URL);

$returnflag = $curl->delete($delurl, "DELETE_CUSTOMER_ON_CMI");

 //If there is an error, return error msg
 if ( $returnflag ) {
	$logger->info('Del_Customer_CMI SUCCESS. CIDN => '.$cidn); 	
	echo $curl->taskid;
}
 else {
 	$logger->error('Del_Customer_CMI FAILED. CIDN => '.$cidn);
 	echo 'Error: Delete Customer to CMI Model met error=> '.$curl->errormessage;

}

	 
?>
