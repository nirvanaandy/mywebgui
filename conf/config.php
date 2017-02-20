<?php
/*
 * CMI Web GUI Configuration
 *
 */
//NCX Server information
$CONFIG['NCX_SERVER'] ='203.58.209.189';
$CONFIG['NCX_SERVER_PORT'] ='443';
$CONFIG['NCX_USER_ACCOUNT'] ='admin';
$CONFIG['NCX_USER_PASSWD'] ='admin';

//NCX API related setting
$CONFIG['CONTENT_TYPE'] ='application/xml';
$CONFIG['API_VERSION'] ='2.0';
$CONFIG['AUTHORIZATION'] ='Basic';
$CONFIG['SSL_VERIFYHOST'] ='false';
$CONFIG['TASK_HEAD'] ='X-TASK-ID';

$CONFIG['URL_PREFIX'] = 'https://'.$CONFIG['NCX_SERVER'].':'.$CONFIG['NCX_SERVER_PORT'];

$CONFIG['BEGIN_TASK_URL'] = $CONFIG['URL_PREFIX'].'/restconf/operations/tasks:begin-task.xml';
$CONFIG['COMMIT_TASK_URL'] = $CONFIG['URL_PREFIX'].'/restconf/operations/tasks:commit-task.xml';

$CONFIG['GET_TASK_BASIC_URL'] = $CONFIG['URL_PREFIX'].'/restconf/operations/tasks:get-basic-task-detail.xml';

$CONFIG['GET_TASK_DETAIL_URL'] = $CONFIG['URL_PREFIX'].'/restconf/operations/tasks:get-full-task-detail.xml';

$CONFIG['GET_CUSTOMER_CMI_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cmi-model.xml?fields=per-customer-cmi-instance(cidn;cust-name)';

$CONFIG['GET_CUSTOMER_CPE_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model.xml?fields=customer(customer-name;cidn)';

$CONFIG['GET_CUSTOMER_SITE_CPE_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1]/customer-sites.xml?fields=customer-site(site-id;site-name)';

$CONFIG['GET_CPE_CUSTOMER_SITE_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1]/customer-sites/customer-site=$[2]/cpes.xml?fields=cpe(cpe-name)';

//Temporarily use a fack url
//$CONFIG['ONBOARD_CUSTOMER_CMI_URL']='https://203.58.209.189:1443/restconf/data/controller:services/cmi:cmi-maas-services/cmi-model.xml';

$CONFIG['ONBOARD_CUSTOMER_CMI_URL']=$CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cmi-model.xml';

//$CONFIG['ONBOARD_CUSTOMER_CPE_URL']='https://203.58.209.189:1443/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model.xml';

$CONFIG['ONBOARD_CUSTOMER_CPE_URL']=$CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model.xml';


//$CONFIG['ONBOARD_CUSTOMER_SITE_CPE_URL'] = 'https://203.58.209.189:1443//restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1]/customer-sites.xml';

$CONFIG['ONBOARD_CUSTOMER_SITE_CPE_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1]/customer-sites.xml';

//$CONFIG['ONBOARD_CPE_CUSTOMER_SITE_URL'] = 'https://203.58.209.189:1443/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1]/customer-sites/customer-site=$[2]/cpes.xml';

$CONFIG['ONBOARD_CPE_CUSTOMER_SITE_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1]/customer-sites/customer-site=$[2]/cpes.xml';

//$CONFIG['SHIP_CPE_URL'] = 'https://203.58.209.189:1443//restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1]/customer-sites/customer-site=$[2]/cpes/cpe=$[3].xml';

$CONFIG['SHIP_CPE_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1]/customer-sites/customer-site=$[2]/cpes/cpe=$[3].xml';

//$CONFIG['DELETE_CUSTOMER_CPE_URL'] = 'https://203.58.209.189:1443/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1].xml';
$CONFIG['DELETE_CUSTOMER_CPE_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1].xml';


//$CONFIG['DELETE_CUSTOMER_CMI_URL'] = 'https://203.58.209.189:1443/restconf/data/controller:services/cmi:cmi-maas-services/cmi-model/per-customer-cmi-instance=$[1].xml';
$CONFIG['DELETE_CUSTOMER_CMI_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cmi-model/per-customer-cmi-instance=$[1].xml';


//$CONFIG['DELETE_CUSTOMER_SITE_CPE_URL'] = 'https://203.58.209.189:1443/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1]/customer-sites/customer-site=$[2].xml';

$CONFIG['DELETE_CUSTOMER_SITE_CPE_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[1]/customer-sites/customer-site=$[2].xml';

//$CONFIG['DELETE_CPE_CUSTOMER_SITE_URL'] = 'https://203.58.209.189:1443/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[0]/customer-sites/customer-site=$[1]/cpes/cpe=$[3].xml';

$CONFIG['DELETE_CPE_CUSTOMER_SITE_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cpe-model/customer=$[0]/customer-sites/customer-site=$[1]/cpes/cpe=$[3].xml';

//URLs for one-time tasks
$CONFIG['CREATE_CMMI_MAAS_SERVICE_CONTAINER_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services.xml';
//$CONFIG['CREATE_CMMI_MAAS_SERVICE_CONTAINER'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:servicesBAD.xml';

$CONFIG['CREATE_GLOBAL_CMI_SETTING_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cmi-model.xml';
//$CONFIG['CREATE_GLOBAL_CMI_SETTING'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cmi-modelBAD.xml';

$CONFIG['ONBOARD_CMI_POP_LOCATION_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cmi-model/cmi-pop-locations.xml';

//$CONFIG['ONBOARD_CMI_POP_LOCATION'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cmi-model/cmi-pop-locationsBAD.xml';

$CONFIG['CREATE_FIREWALL_CONTEXT_URL'] = $CONFIG['URL_PREFIX'].'/restconf/data/controller:services/cmi:cmi-maas-services/cmi-model/cmi-pop-locations/cmi-pop-location=lonsdale/firewall-attributes/firewall-pair=$[1]/contexts.xml';
//$CONFIG['CREATE_FIREWALL_CONTEXT'] = $CONFIG['URL_PREFIX'].'restconf/data/controller:services/cmi:cmi-maas-services/cmi-model/cmi-pop-locations/cmi-pop-location=lonsdale/firewall-attributes/firewall-pair=$[1]/contextsBAD.xml';

require_once './vendor/autoload.php';
use Katzgrau\KLogger\Logger;
use Psr\Log\LogLevel;

$logger = new Logger(__DIR__.'/../logs');
//$logger->info('Start logging ......');

?>