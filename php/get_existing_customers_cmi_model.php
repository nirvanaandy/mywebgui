
<?php

$output = shell_exec('curl -X GET -v --insecure -u admin:admin -H Content:application/xml -H APIVersion:2.0 https://203.58.209.189:443/restconf/data/controller:services/cmi:cmi-maas-services/cmi-model.xml -o existing_customers_cmi_model.xml');
echo $output;

?>


