<?php
$xmlfilename='/var/www/html/xmls/onboard_customer_site_to_cpe_model'.time().'.xml';
$myfile = fopen($xmlfilename, "w+") or die("Unable to open file!");

$message = $_POST['message']; // incoming message

fwrite($myfile, $message);
fclose($myfile);

$output = shell_exec('/bin/bash /var/www/html/scripts/onboard_customer_site_cpe_model.sh '.$xmlfilename);
$output = "Running Onboard Customer Site to CPE Model Script ... ...";

echo $output;

?>


