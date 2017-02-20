<?php
require_once '../conf/config.php';
//require_once './vendor/autoload.php';
require_once './curlclass.php';

echo "Before call curl<br/>";
$curl = new cURL($logger);
echo "Test <br/>";
//$curl->get_general(GET_CUSTOMER_CPE_URL, "GET_CUSTOMER_CPE");
//$curl->monitor_task_detail("34b923f2-6d2f-42e2-bbfa-a8779f1ac46e");
//$curl->monitor_task_basic("34b923f2-6d2f-42e2-bbfa-a8779f1ac46e");

// $delcidn = "0123459876";
// $delurl = str_replace('$[1]',$delcidn,DELETE_CUSTOMER_CPE_URL);
// echo $delurl.'<br/>';
// $curl->delete($delurl,"DELETE_CUSTOMER_ON_CPE");

$xmlcontent='<?xml version="1.0"?>
<customer>
    <customer-name>UUU</customer-name>
    <cidn>1134567777</cidn>
    <customer-sites/>
</customer>';

$curl->onboard(ONBOARD_CUSTOMER_CPE_URL,$xmlcontent,"ONBOARD_CUSTOMER_CPE");

echo $curl->result;
echo '<br/>';
echo $curl->response;
echo '<br/>';
echo $curl->errormessage;

?>