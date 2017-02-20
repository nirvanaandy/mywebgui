<?php
/* cURL class for calling NCX APIs
 * Created 02032017
 */
require_once '../conf/config.php';

foreach(array_keys($CONFIG) as $key) {
  define($key, $CONFIG[$key]);
}

class cURL
{
  private $useragent; // user agent string
  private $handle;    // handle to the cURL object
  private $cookies;   // boolean value whether to use/store cookies or not
  private $redirs;    // boolean value whether to follow redirects or not
  public $cookiejar;  // filename of the cookie jar
  public $data;       // last data returned from a cURL transfer
  public $code;       // the last HTTP code returned
  public $url;        // URL of the page we are currently at
  public $info;       // information about the last cURL transfer
  private $proxy;     // proxy adress
  private $proxypwd;  // proxy password
  public $xhr;        // boolean value whether to use XHR (XMLHttpRequest) or not
  public $serverhost;  //the target server
  public $serverport; 
  public $useraccount; //User account and password
  public $password; 
  public $taskid;   
  public $response; 
  public $errormessage; 
  public $result;
  public $logger;
 
  function __construct( $logger )
  {
    $this->serverhost = NCX_SERVER;
    $this->useraccount = NCX_USER_ACCOUNT;
    $this->password = NCX_USER_PASSWD;
    $this->serverport=NCX_SERVER_PORT;

    $this->response = "";
    $this->taskid = "";
    $this->errormessage="";
    $this->logger = $logger;
  }

  function __destruct(){
    unset($this->handle);
  }

  private function set_common_options() {

    curl_setopt($this->handle, CURLOPT_HEADER,true);
    $optstr = array('Content-Type: '.CONTENT_TYPE,'APIVersion: '.API_VERSION);
    
    curl_setopt($this->handle, CURLOPT_HEADER, $optstr);  
    curl_setopt($this->handle, CURLOPT_HEADER, array('Authorization: '.AUTHORIZATION));  
    
    curl_setopt($this->handle, CURLOPT_HTTPHEADER, $optstr);

    curl_setopt($this->handle, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($this->handle, CURLOPT_USERPWD, NCX_USER_ACCOUNT.':'.NCX_USER_PASSWD);
    curl_setopt($this->handle,CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($this->handle,CURLOPT_SSL_VERIFYPEER, 0);
  }

  private function call_curl_exec( $responseexpected ){

    $this->result=curl_exec($this->handle); 
    if ( curl_errno($this->handle)) {
      $this->errormessage = 'Error returned calling curl_exec. Error: '. curl_error($this->handle);
      $this->logger->error($this->errormessage);
      $this->logger->debug('HTTP Response: \n'.$this->result);
      return false;         
    }

    $this->response =  curl_getinfo($this->handle,CURLINFO_HTTP_CODE);
    if ( $this->response != $responseexpected ) {
      $this->errormessage = 'HTTP response is not the expected. Expect '.$responseexpected.', but response: '.$this->response;
      $this->logger->error($this->errormessage);
      $this->logger->debug('HTTP Response: \n'.$this->result);
      return false;         
    }
    return true;

  }

  private function begin_task ( $operationname)
  {

    $this->logger->info('TASK BEGIN : For Operation => '.$operationname);

    curl_setopt($this->handle,CURLOPT_URL,BEGIN_TASK_URL);
    curl_setopt($this->handle, CURLOPT_POST, true);

    $returnflag = $this->call_curl_exec("200");

    if ( $returnflag ) {
      //Executed correctly, retrieve the xml content for taskId
      $this->retrieveXMLContentFromResponse();
      
      //retrieve taskId from xml
      $xml = simplexml_load_string($this->result);
      $json = json_encode($xml);
      $taskIdArray = json_decode($json, TRUE);
   
      $this->taskid = $taskIdArray[0];

      $this->logger->info('TASK BEGIN: SUCCESS. For Operation => '.$operationname.' TASKID = '.$this->taskid);
      return true;
    }
    else {
      $this->logger->info('TASK BEGIN: FAILED For Operation => '.$operationname);      
      return false;
    }
  }

  public function commit_task( $operationname )
  {

    $this->logger->info('TASK COMMIT : For Operation => '.$operationname.' TASKID => '.$this->taskid);

    curl_setopt($this->handle,CURLOPT_URL,COMMIT_TASK_URL);
    curl_setopt($this->handle, CURLOPT_POST, true);
    curl_setopt($this->handle, CURLOPT_CUSTOMREQUEST,"POST");
    curl_setopt($this->handle,CURLOPT_HTTPHEADER, array(TASK_HEAD.':'.$this->taskid));

    $returnflag = $this->call_curl_exec("202");

    if ( $returnflag ) {
      $this->logger->info('TASK COMMIT: SUCCESS. For Operation => '.$operationname.' TASKID = '.$this->taskid);
      return true;
    }
    else {
      $this->logger->info('TASK COMMIT: FAILED. For Operation => '.$operationname.' TASKID = '.$this->taskid);      
      return false;
    }
   
  }
  
  public function monitor_task_basic( $currenttaskid ) {

    $this->logger->info('MONITORING TASK BASIC: taskId => '.$currenttaskid);

    $this->taskid = $currenttaskid;
    $this->handle = curl_init();
    $this->set_common_options();

    curl_setopt($this->handle, CURLOPT_URL, GET_TASK_BASIC_URL);
    curl_setopt($this->handle,CURLOPT_HTTPHEADER, array(TASK_HEAD.':'.$this->taskid));
    curl_setopt($this->handle, CURLOPT_POST, true);

    $returnflag = $this->call_curl_exec("200");

    curl_close($this->handle);

    if ( $returnflag ) {
      //Executed correctly, retrieve the xml content
      $this->retrieveXMLContentFromResponse();
      $this->logger->info($this->result);

      $this->logger->info("MONITORING TASK BASIC: SUCCESS\n");
      //Retreieve the <status> and <percentComplete> elements and return
      $xmlparser = xml_parser_create();
      xml_parse_into_struct($xmlparser, $this->result, $vals,$index);
      xml_parser_free($xmlparser);
      $this->result = 'TASK STATUS: '.$vals[2]['value'].' | PERCENTAGE COMPLETION: '.$vals[6]['value'];
      $this->logger->info($this->result);
      return $this->result;
    }
    else {
      $this->logger->info("MONITORING TASK BASIC: FAILED\n");      
      return $this->errormessage;
    }
 
  }

  public function monitor_task_detail( $currenttaskid ){

    $this->logger->info('MONITORING TASK DETAIL: taskId => '.$currenttaskid);
    $this->taskid = $currenttaskid;
    $this->handle = curl_init();
    $this->set_common_options();

    curl_setopt($this->handle, CURLOPT_URL, GET_TASK_DETAIL_URL);
    curl_setopt($this->handle,CURLOPT_HTTPHEADER, array(TASK_HEAD.':'.$this->taskid));
    curl_setopt($this->handle, CURLOPT_POST, true);

    $returnflag = $this->call_curl_exec("200");

    curl_close($this->handle);

    if ( $returnflag ) {
      $this->logger->info("MONITORING TASK DETAIL: SUCCESS\n");
      return $this->result;
    }
    else {

      $this->logger->info("MONITORING TASK DETAIL: FAILED\n");      
      return $this->errormessage;
    }

  }

  public function get_general( $apiurl, $getoperationname )
  {

    $this->logger->info('GET '.$getoperationname.' BEGIN. URL: '.$apiurl);

    $this->handle = curl_init();
    $this->set_common_options();

    curl_setopt($this->handle, CURLOPT_URL, $apiurl);

    $returnflag = $this->call_curl_exec("200");

    curl_close($this->handle);

    if ( $returnflag ) {
      //Executed correctly, retrieve the xml content
      $this->retrieveXMLContentFromResponse();
      $this->logger->info($this->result);

      $this->logger->info('GET '.$getoperationname.' SUCCESS\n');
      return $this->result;
    }
    else {
      $this->logger->info('GET '.$getoperationname.' FAILED\n');      
      return $this->errormessage;
    }

  }

  public function onboard($apiurl, $xmlcontent, $operationname)
  {
    $this->logger->info('ONBOARD '.$operationname.' BEGIN. URL: '.$apiurl);
    $this->logger->debug('PAYLOAD: '.$xmlcontent);

    $this->handle = curl_init();
    $this->set_common_options();

    //Call the begin_task() to get the taskid
    $returnflag = $this->begin_task($operationname);

    if ( !$returnflag ) {
      curl_close($this->handle);
      $this->logger->info('ONBOARD '.$operationname.' FAILED during calling begin_task. URL: '.$apiurl);      
      return false;
    }

    //Call the onboard API
    //curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/xml','APIVersion: 2.0','X-TASK-ID:'. $taskId));
    curl_setopt($this->handle,CURLOPT_URL,$apiurl);
    curl_setopt($this->handle,CURLOPT_HTTPHEADER, array('Content-Type: application/xml',TASK_HEAD.':'.$this->taskid));

    curl_setopt($this->handle,CURLOPT_POSTFIELDS,$xmlcontent);


    $returnflag = $this->call_curl_exec("202");

    if ( !$returnflag ) {
        //Execute wrong
      curl_close($this->handle);
      $this->logger->info('ONBOARD '.$operationname.' FAILED during calling ONBOARD API. URL: '.$apiurl);      
      return false;      
    }

    $this->logger->info('ONBOARD '.$operationname.' API called success. URL: '.$apiurl);

    //Call the commit_task() 
    $returnflag = $this->commit_task($operationname); 
    if ( !$returnflag ) {
      curl_close($this->handle);
      $this->logger->info('ONBOARD '.$operationname.' FAILED during calling commit_task. URL: '.$apiurl);      
      return false;      
    }

    curl_close($this->handle);
    $this->logger->info('ONBOAD '.$operationname.' SUCCESS. URL: '.$apiurl);      

    return true;

  }

  public function delete( $apiurl, $operationname )
  {

    $this->logger->info('DELETE '.$operationname.' BEGIN. URL: '.$apiurl);

    $this->handle = curl_init();
    $this->set_common_options();

    //Call the begin_task() to get the taskid
    $returnflag = $this->begin_task($operationname);
    if ( !$returnflag ) {
      curl_close($this->handle);
      $this->logger->info('DELETE '.$operationname.' FAILED during calling begin_task. URL: '.$apiurl);      
      return false;
    }

    //Call the delete API
    curl_setopt($this->handle, CURLOPT_CUSTOMREQUEST,"DELETE");
    curl_setopt($this->handle,CURLOPT_URL,$apiurl);
    curl_setopt($this->handle,CURLOPT_HTTPHEADER, array(TASK_HEAD.':'.$this->taskid));
 
    $returnflag = $this->call_curl_exec("202");

    if ( !$returnflag ) {
        //Execute wrong
      curl_close($this->handle);
      $this->logger->info('DELETE '.$operationname.' FAILED during calling DEL API. URL: '.$apiurl);      
      return false;      
    }

    $this->logger->info('DELETE '.$operationname.' API called success. URL: '.$apiurl);

    //Call the commit_task() 
    $returnflag = $this->commit_task($operationname); 
    if ( !$returnflag ) {
      curl_close($this->handle);
      $this->logger->info('DELETE '.$operationname.' FAILED during calling commit_task. URL: '.$apiurl);      
      return false;      
    }

    curl_close($this->handle);
    $this->logger->info('DELETE '.$operationname.' SUCCESS. URL: '.$apiurl);      

    return true;
  }

  public function retrieveXMLContentFromResponse() {
    //Ignore the HTTP response head, retrieve the xml content
    $pos = strpos($this->result,'GMT');
    if ($pos == false){
        $this->errormessage = 'Error returned calling '.$url.'. Cannot find the xml content in HTTP response';
        return false;
    }
    else {
        $this->result = trim(substr($this->result, $pos+3));
        return true;
    }
    
  }

  public function set_proxy( $proxy, $auth = '' )
  {
    $this->proxy    = $proxy;
    $this->proxypwd = $auth;
  }
 
  private function setopt( $url, $referer )
  {
    curl_setopt( $this->handle, CURLOPT_URL, $url );
    curl_setopt( $this->handle, CURLOPT_HEADER, 0 );
 
    if( $this->redirs )
    {
      curl_setopt( $this->handle, CURLOPT_FOLLOWLOCATION, 1 );
      curl_setopt( $this->handle, CURLOPT_MAXREDIRS, 10 );
    }
    else
    {
      curl_setopt( $this->handle, CURLOPT_FOLLOWLOCATION, 0 );
      curl_setopt( $this->handle, CURLOPT_MAXREDIRS, 0 );
    }
 
    curl_setopt( $this->handle, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt( $this->handle, CURLOPT_USERAGENT, $this->useragent );
 
    if( substr( $url, 4, 1 ) == 's' )
    {
      curl_setopt( $this->handle, CURLOPT_SSL_VERIFYPEER, false );
      curl_setopt( $this->handle, CURLOPT_SSL_VERIFYHOST, false );
    }
 
    if( $this->cookies )
    {
      curl_setopt( $this->handle, CURLOPT_COOKIEJAR, $this->cookiejar );
      curl_setopt( $this->handle, CURLOPT_COOKIEFILE, $this->cookiejar );
    }
 
    if( $this->proxy != '' )
    {
      curl_setopt( $this->handle, CURLOPT_PROXY, $this->proxy );
 
      if( $this->proxypwd != '' )
      {
        curl_setopt( $this->handle, CURLOPT_PROXYUSERPWD, $this->proxypwd );
      }
    }
 
    if( $referer != '' )
    {
      curl_setopt( $this->handle, CURLOPT_REFERER, $referer );
    }
 
    if( $this->xhr == true )
    {
      curl_setopt( $this->handle, CURLOPT_HTTPHEADER, array( "X-Requested-With: XMLHttpRequest" ) );
    }
  }

   function post( $url, $data, $referer = '', $xhr = false )
  {
    $this->handle = curl_init();
 
    $fields_string = '';
    if( is_array( $data ) )
    {
      foreach( $data as $key => $value )
      {
        $fields_string .= $key . '=' . $value . '&';
      }
      rtrim( $fields_string, '&' );
    }
    else
    {
      $fields_string = $data;
    }
 
    $this->xhr = $xhr;
    $this->setopt( $url, $referer );
 
    curl_setopt( $this->handle, CURLOPT_POST, 1 );
    curl_setopt( $this->handle, CURLOPT_POSTFIELDS, $fields_string );
 
    $this->data = curl_exec( $this->handle );
    $this->code = curl_getinfo( $this->handle, CURLINFO_HTTP_CODE );
    $this->info = curl_getinfo( $this->handle );
    $this->url  = ( isset( $this->info['redirect_url'] ) && !empty( $this->info['redirect_url'] ) != '' ? $this->info['redirect_url'] : $this->info['url'] );
    curl_close( $this->handle );
 
    return $this->data;
  }
 
  function get( $url, $referer = '', $xhr = false )
  {
    $this->handle = curl_init();
 
    $this->xhr = $xhr;
    $this->setopt( $url, $referer );
 
    $this->data = curl_exec( $this->handle );
    $this->code = curl_getinfo( $this->handle, CURLINFO_HTTP_CODE );
    $this->info = curl_getinfo( $this->handle );
    $this->url  = ( isset( $this->info['redirect_url'] ) && !empty( $this->info['redirect_url'] ) != '' ? $this->info['redirect_url'] : $this->info['url'] );
    curl_close( $this->handle );
 
    return $this->data;
  }
 
  public function xmlcode($tag) {
    $tag = str_replace("&", "&amp;", $tag);
    $tag = str_replace("<", "&lt;", $tag);
    $tag = str_replace(">", "&gt;", $tag);
    $tag = str_replace("'", "&apos;", $tag);
    $tag = str_replace("\"", '&quot;', $tag);
    return $tag;
  }

  public function cleanup()
  {
    if( file_exists( $this->cookiejar ) )
    {
      unlink( $this->cookiejar );
    }
  }
}