<?php
$xmlfilename='/var/www/html/xmls/onboard_cpe_to_customersite_'.time().'.xml';
$myfile = fopen($xmlfilename, "w+") or die("Unable to open file!");


$message = $_POST['message']; // incoming message

fwrite($myfile, $message);
fclose($myfile);

$output = shell_exec('/bin/bash /var/www/html/scripts/onboard_cpe_customer_site.sh '.$xmlfilename);
$output = "Running Onboard CPE to Customer Site Script ... ...";

echo $output;

?>
