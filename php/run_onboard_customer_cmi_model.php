
<?php
$xmlfilename='/var/www/html/xmls/onboard_customer_cmi_model_'.time().'.xml';
$myfile = fopen($xmlfilename, "w+") or die("Unable to open file!");

$message = $_POST['message']; // incoming message

fwrite($myfile, $message);
fclose($myfile);


$output = shell_exec('/bin/bash /var/www/html/scripts/onboard_customer_cmi_model.sh '.$xmlfilename);
$output = "Running Onboard Customer in CMI Model Script ... ...";
echo $output;

?>



