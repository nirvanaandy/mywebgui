/***************************************************************************/
/* This js file is for all_in_one.html only, to avoid making the file big  */
/***************************************************************************/


/***  Below is for Onboard CPE to Customer Site   ***/
//When pre-configured is false, clear the input of subnet, gateway ip, local ip
$('#pre-configured').on("change",function(){

    if($(this).val() == "False") {
        $('#subnet').val("");
        $('#gateway-ip').val("");
        $('#local-ip').val("");
    }
});

$('#triggerValidate').on('click',function(event)
  {

    if ( ! validateCPEForm())
        return;

    $('#validationerrorlabel').text("");
    //If validate correct, then trigger the click of realSubmit
    //$('#onboardCPEtoCustomerSite').click();
    
});

//return true if sucess, otherwise, false
function validateCPEForm(){

    if($('#cpe-name').val().length<=0) {
        $('#validationerrorlabel').text("Please input CPE Name.");
        $('#cpe-name').focus();
        return false;
    }

    if($('#domain-controller').val().length<=0) {
        $('#validationerrorlabel').text("Please input Domain Controller Name.");
        $('#domain-controller').focus();
        return false;
    }

    if($('#cpe-as-number').val().length<=0) {
        $('#validationerrorlabel').text("Please input CPE as Number.");
        $('#cpe-as-number').focus();
        return false;
    }

    if($('#pe-as-number').val().length<=0) {
        $('#validationerrorlabel').text("Please input PE as Number.");
        $('#pe-as-number').focus();
        return false;
    }

    if($('#pe-router-name').val().length<=0) {
        $('#validationerrorlabel').text("Please input PE Router Name.");
        $('#pe-router-name').focus();
        return false;
    }

    if($('#deployment-template-name').val().length<=0) {
        $('#validationerrorlabel').text("Please input Deployment Template Name.");
        $('#deployment-template-name').focus();
        return false;
    }

    if($('#customer-username').val().length<=0) {
        $('#validationerrorlabel').text("Please input Customer Username.");
        $('#customer-username').focus();
        return false;
    }

    if($('#customer-password').val().length<=0) {
        $('#validationerrorlabel').text("Please input Customer Password.");
        $('#customer-password').focus();
        return false;
    }

    //check if all 4 network inputted
    var allNetworkNames = retrieveAllNetworkNames();

    if( allNetworkNames.indexOf('nfx-oam') < 0) {
        $('#validationerrorlabel').text("Lack of network nfx-oam!");
        return false;
    }
    if( allNetworkNames.indexOf('nfx-wan0') < 0) {
        $('#validationerrorlabel').text("Lack of network nfx-wan0!");
        return false;
    }
    if( allNetworkNames.indexOf('nfx-wan1') < 0) {
        $('#validationerrorlabel').text("Lack of network nfx-wan1!");
        return false;
    }
    if( allNetworkNames.indexOf('nfx-lan') < 0) {
        $('#validationerrorlabel').text("Lack of network nfx-lan!");
        return false;
    }


    return true;
}

//Retrieve the existing customers on CPE, fill the select customer listbox
$().ready( function(){

    $.post("/php/get_customer_cpe.php").done(function(data){
      //alert(data);
      //Then analyse the xml, fill the customer listbox
      var xmlDoc = $.parseXML(data);
      $(xmlDoc).find("customer").each( function () {
      
          var custname = $('customer-name',this).text();
          var cidn=$('cidn',this).text();
          var optionStr = '<option value="'+cidn+'">'+custname+'</option>';
          
          $('#customerlist').append(optionStr);
          });
      });

    //$('#customerlist option:first').trigger('change');
    //alert($('#customerlist').find('option:selected').value());
});


//When selected customer change in customer listbox, then change customer sites correcpondingly
$('#customerlist').change(function(){
    
    var customerCidn = $(this).val();
    var customerName = $(this).find('option:selected').text();
    //alert(customerName + ":"+customerCidn);
    //Empty the cusotmer site listbox
    $('#customersitelist').empty();
    $.post("/php/get_customer_site_cpe.php",{ cidn: customerCidn }).done(function(data){
      //alert(data);
      //Then analyse the xml, build the site table
      var xmlDoc = $.parseXML(data);
      $(xmlDoc).find("customer-site").each( function () {
      
          var siteName = $('site-name',this).text();
          var siteId=$('site-id',this).text();

          var optionStr = '<option value="'+siteId+'">'+siteName+'</option>';
          
          $('#customersitelist').append(optionStr);
          });

      });

});

//initiate the tooltip
$().ready(function () { $("[data-toggle='tooltip']").tooltip(); 

  for( var key in onboardCPECustomerSiteTips) {
      //alert(key+":"+onboardCPECustomerSiteTips[key]);
      //alert($(key).attr('id'));
      $('#'+key).attr('title',onboardCPECustomerSiteTips[key]);
  }

});

var selectedDevice = { deviceName: "", deviceType: "Server", natRequired: "False", monitoringRequired: "True"};
var selectedNetwork = { networkName: "nfx-oam", subnetType: "CPEMGMT", size: "",preConfigured: "False", subnet: "", gatewayIP: "", 
                        localIP: "", localInterface: ""};

function setSelectedDeviceDefaultValue() {
    selectedDevice.deviceName = "";
    selectedDevice.deviceType = "Server";
    selectedDevice.natRequired = "False";
    selectedDevice.monitoringRequired = "True";
}

function setSelectedNetworkDefaultValue() {
    selectedNetwork.networkName = "nfx-oam";
    selectedNetwork.subnetType = "CPEMGMT";
    selectedNetwork.size = "";
    selectedNetwork.preConfigured = "False";
    selectedNetwork.subnet = "";
    selectedNetwork.gatewayIP = "";
    selectedNetwork.localIP = "";
    selectedNetwork.localInterface = "";

}

$('#cpe-name').focus();

//Set the focus when each tabpage shown
$('a[data-toggle="tab"').on('shown.bs.tab',function(e){
    var activeTab = $(e.target).text();
    if (activeTab == "CPE")
        $('#cpe-name').focus();
    else if (activeTab == "Domain Controller")
        $('#domain-controller').focus();
    }

);

$('#onboardCPEtoCustomerSite').on('click', function(event) {

    console.log("Onboard CPE to Customer Site Submit Button Pressed");

    var onboardCPEToCustomerSitePayload = 
    `<?xml version="1.0"?>
     <cpe> 
       `+ retrieveCPEBaseXML()+
          retrieveAllDevices()+
          retrieveAllNetworks()+
       `
       <add-device-to-sciencelogic/>
  </cpe>`;

    console.log(onboardCPEToCustomerSitePayload);
    
    //Set the target customer site text
    var customerCidn = $('#customerlist').val();
    var customerName = $('#customerlist').find('option:selected').text();
    var siteId = $('#customersitelist').val();
    var siteName = $('#customersitelist').find('option:selected').text();
    var targetTxt = "Onboard to "+customerName+"("+customerCidn+") on "+siteName+"("+siteId+")";

    $('#targetcustomersitetext').text(targetTxt);
    document.getElementById("xmltext").value = onboardCPEToCustomerSitePayload;

});



$('#goAheadButton').on('click', function(event) {


    console.log("finalbuttonPressed");
    var finalPayload = document.getElementById("xmltext").value

    console.log("FINAL PAYLOAD IS");
    console.log(finalPayload);

    var customerCidn = $('#customerlist').val();
    var siteId = $('#customersitelist').val();
    //alert(customerCidn+" "+siteId);
    $.post("/php/onboard_cpe_customer_site.php",{ customer_cidn: customerCidn, site_id: siteId, cpe_xml: finalPayload })
      .done(function( data ) {
            refreshStatusDivBasedonPostResult(data, "Onboard CPE to Customer Site");
      });

    document.getElementById('infoDiv').style.display = "block";
    document.getElementById('onboardCPECustomerSiteForm').style.display = "none";
    $('#myModal').modal('hide');

});

//Clear the input in Device Modal when hide it
$(function(){
    //Clear the inputted Device details when hide;
    $('#deviceModal').on('hide.bs.modal',
            function(){
                setSelectedDeviceDefaultValue();
            });
    //Fill the Device Detail when open if there is an existing device selected
    $('#deviceModal').on('show.bs.modal',
            function(){
                //alert('Fill the device detail!');
                $('#device-name').val(selectedDevice.deviceName);
                $("#device-type").val(selectedDevice.deviceType);
                $("#nat-required").val(selectedDevice.natRequired);
                $("#monitoring-required").val(selectedDevice.monitoringRequired);
                //If deviceName is not empty, then it's Update, set the button to "Update"
                if(selectedDevice.deviceName.length >0) {
                    $('#createdevicebtn').text("Update");
                    $('#closedevicebtn').hide();
                }
                else {
                    $('#closedevicebtn').show();
                    $('#createdevicebtn').text("Create");
                }
                //Set the focus on device name input
                $('#device-name').focus();
            });
    //Clear the inputted Network details when hide networkModal
    $('#networkModal').on('hide.bs.modal',
            function(){
                
                setSelectedNetworkDefaultValue();
            });

    //Fill the Network Detail when open if there is an existing network selected
    $('#networkModal').on('shown.bs.modal',
        function(){
            $('#network-name').val(selectedNetwork.networkName);
            $('#subnet-type').val(selectedNetwork.subnetType);
            $('#size').val(selectedNetwork.size);
            $('#pre-configured').val(selectedNetwork.preConfigured);
            $('#subnet').val(selectedNetwork.subnet);
            $('#gateway-ip').val(selectedNetwork.gatewayIP);
            $('#local-ip').val(selectedNetwork.localIP);                
            $('#local-interface').val(selectedNetwork.localInterface);
            //If networkName is not empty, then it's Update, set the button to "Update"
            if(selectedNetwork.size.length >0){
                $('#createnetworkbtn').text("Update");
                $('#closenetworkbtn').hide();
            }
            else {
                $('#createnetworkbtn').text("Create");
                $('#closenetworkbtn').show();
            }

            //Set the focus on network name input
            $('#networkName').focus();

    });

});

function validateAlpha (value) {
    var regex = "^[0-9a-zA-Z-_]+$";
    regex = new RegExp(regex);
    return regex.test(value);
}


function addDevice() {


    selectedDevice.deviceName = $('#device-name').val();
    selectedDevice.deviceType = $('#device-type').val();
    selectedDevice.natRequired = $('#nat-required').val();
    selectedDevice.monitoringRequired = $('#monitoring-required').val();

    //Validate the device 
    if( selectedDevice.deviceName <=0 ){
        alert("Please input Device Name.")
        $('#device-name').focus();
        return;
    }
    //alert(validateAlpha(selectedDevice.deviceName));
    if (!validateAlpha(selectedDevice.deviceName)){
        alert("Device Name only accept alphanumeric, '-'/dash and '_'/underline.");
        $('#device-name').focus();
        return;
    }

    var trStr = "<tr><td>" + selectedDevice.deviceName +
            "</td><td>" +
            selectedDevice.deviceType +"</td><td>" + selectedDevice.natRequired +
            "</td><td>" + selectedDevice.monitoringRequired+"</td>" +
            "<td align='center'><button type='button' id='del_"+selectedDevice.deviceName +
            "'>Delete</button></td></tr>";


    var tmpDeviceName = selectedDevice.deviceName;

    $('#deviceModal').modal('hide');
    $('#deviceTable tbody').append(trStr);
    //add function to delete button click and tr double click
    $('#del_'+tmpDeviceName).click(function(){
        $(this).parent().parent().remove();
    });

    //This is useless, deviceModal hide will set to default
    setSelectedDeviceDefaultValue();

    $('#deviceTable tr').dblclick(
            function(){
                var row = $(this).closest("tr");

                selectedDevice.deviceName = row.find('td:eq(0)').text();
                selectedDevice.deviceType = row.find('td:eq(1)').text();
                selectedDevice.natRequired = row.find('td:eq(2)').text();
                selectedDevice.monitoringRequired = row.find('td:eq(3)').text();
                $(this).remove();
                $('#deviceModal').modal('show');

            }
    );
}

function retrieveAllDevices(){
    //alert("In retrieve");
    var deviceStr=`
    <device-details>`;
    $('#deviceTable').find('tr').each(
      function() {
          var tdAttr =  $(this).find("td");
          var deviceName = tdAttr.eq(0).text();
          var deviceType = tdAttr.eq(1).text();
          var netRequired = tdAttr.eq(2).text();
          var monitoringRequired = tdAttr.eq(3).text();
          if( deviceName != "" && deviceType !="") {
              deviceStr = deviceStr + `
              <device> 
                <device-name>` + deviceName + `</device-name>
                <device-type>` + deviceType + `</device-type>
                <nat-required>` + netRequired + `</nat-required>
                <monitoring-required>` + monitoringRequired + `</monitoring-required>
              </device>`;
          }
      }
    );
    deviceStr = deviceStr + `
    </device-details>`;
    //alert(deviceStr);
    return deviceStr;
}

function validateIPv4(value) {

 return /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
}

function validateSubnet(value){
    return /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\/(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
}

//Success, return true; otherwise false.
function validateNetworkForm(){
    if(selectedNetwork.size.trim().length <=0){
        $('#validatenetworkerrorlabel').text("Please input the size!");
        $('#size').focus();
        return false;
    }

    //network name vs subnet type
    if( selectedNetwork.networkName == 'nfx-oam' && selectedNetwork.subnetType != 'CPEMGMT'){
        $('#validatenetworkerrorlabel').text("Subnet Type must match with Network Name: \r\n"+
            "nfx-oam -> CPEMGMT, nfx-wan0/1 -> CPEWAN, nfx-lan -> CPELAN.");
        $('#subnet-type').focus();
        return false;
    }

    if( selectedNetwork.networkName == 'nfx-wan0' && selectedNetwork.subnetType != 'CPEWAN'){
        $('#validatenetworkerrorlabel').text("Subnet Type must match with Network Name: \r\n"+
            "nfx-oam -> CPEMGMT, nfx-wan0/1 -> CPEWAN, nfx-lan -> CPELAN.");
        $('#subnet-type').focus();
        return false;
    }

    if( selectedNetwork.networkName == 'nfx-wan1' && selectedNetwork.subnetType != 'CPEWAN'){
        $('#validatenetworkerrorlabel').text("Subnet Type must match with Network Name: \r\n"+
            "nfx-oam -> CPEMGMT, nfx-wan0/1 -> CPEWAN, nfx-lan -> CPELAN.");
        $('#subnet-type').focus();
        return false;
    }

    if( selectedNetwork.networkName == 'nfx-lan' && selectedNetwork.subnetType != 'CPELAN'){
        $('#validatenetworkerrorlabel').text("Subnet Type must match with Network Name: \r\n"+
            "nfx-oam -> CPEMGMT, nfx-wan0/1 -> CPEWAN, nfx-lan -> CPELAN.");
        $('#subnet-type').focus();
        return false;
    }

    //network name vs local interface 
    if( selectedNetwork.networkName == 'nfx-wan0' && selectedNetwork.localInterface != 'WAN_0'){
        $('#validatenetworkerrorlabel').text("Local Interface must be WAN_0 when select nfx-wan0");
        $('#local-interface').focus();
        return false;
    }
    if( selectedNetwork.networkName == 'nfx-wan1' && selectedNetwork.localInterface != 'WAN_1'){
        $('#validatenetworkerrorlabel').text("Local Interface must be WAN_1 when select nfx-wan1");
        $('#local-interface').focus();
        return false;
    }
    

    if ( selectedNetwork.preConfigured == 'True' && ( selectedNetwork.gatewayIP.length <= 0 || selectedNetwork.localIP.length <= 0 || selectedNetwork.subnet.length <=0)){
        $('#validatenetworkerrorlabel').text("Please set up the subnet, gatway ip and local ip if PreConfigured is True!");
        $('#subnet').focus();
        return false;
    }
    //validate the network
    if( selectedNetwork.gatewayIP.length > 0 && (! validateIPv4(selectedNetwork.gatewayIP))){
        $('#validatenetworkerrorlabel').text("Please input a valid IPv4 in Gateway IP.");
        $('#gateway-ip').focus();
        return false;
    }
    if( selectedNetwork.localIP.length > 0 && (! validateIPv4(selectedNetwork.localIP))){
        $('#validatenetworkerrorlabel').text("Please input a valid IPv4 in local IP.");
        $('#local-ip').focus();
        return false;
    }
    //validate the subnet
    if( selectedNetwork.subnet.length > 0 && (! validateSubnet(selectedNetwork.subnet))){
        $('#validatenetworkerrorlabel').text("Please input a valid IPv4 subnet address in Subnet.");
        $('#subnet').focus();
        return false;
    }

    return true;
}

function addNetwork() {

    selectedNetwork.networkName = $('#network-name').val();
    selectedNetwork.subnetType = $('#subnet-type').val();
    selectedNetwork.size = $('#size').val();
    selectedNetwork.preConfigured = $('#pre-configured').val();
    selectedNetwork.subnet = $('#subnet').val();
    selectedNetwork.gatewayIP = $('#gateway-ip').val();
    selectedNetwork.localIP = $('#local-ip').val();
    selectedNetwork.localInterface = $('#local-interface').val();


    if( !validateNetworkForm())
        return;

    $('#validatenetworkerrorlabel').text("");

    //If networkName is 
    var trStr = "<tr> <td>"+selectedNetwork.networkName+
            "</td><td>"+
            selectedNetwork.subnetType+"</td><td>"+selectedNetwork.size+
            "</td><td>"+selectedNetwork.preConfigured+"</td><td>"+
            selectedNetwork.subnet+"</td><td>"+
            selectedNetwork.gatewayIP+"</td><td>"+
            selectedNetwork.localIP + "</td><td>"+
            selectedNetwork.localInterface+"</td>"+
            "<td align='center'><button type='button' id='del_"+selectedNetwork.networkName+"'>Delete</button>"+"</td></tr>";

    //alert(trStr);
    var tmpNetworkName = selectedNetwork.networkName; 

    $('#networkModal').modal('hide');
    $('#networkTable tbody').append(trStr);

    //add function to delete button click and tr double click
    $('#del_'+tmpNetworkName).click(function(){
        $(this).parent().parent().remove();
    });

    setSelectedNetworkDefaultValue();

    $('#networkTable tr').dblclick(
            function(){
                var row = $(this).closest("tr");

                selectedNetwork.networkName = row.find('td:eq(0)').text();
                selectedNetwork.subnetType = row.find('td:eq(1)').text();
                selectedNetwork.size=row.find('td:eq(2)').text();
                selectedNetwork.preConfigured=row.find('td:eq(3)').text();
                selectedNetwork.subnet=row.find('td:eq(4)').text();
                selectedNetwork.gatewayIP=row.find('td:eq(5)').text();
                selectedNetwork.localIP=row.find('td:eq(6)').text();
                selectedNetwork.localInterface=row.find('td:eq(7)').text();

                $(this).remove();
                $('#networkModal').modal('show');

            }
    );

}

function retrieveAllNetworks(){
    //alert("In retrieve");
    var networkStr=`
    <networks>`;
    $('#networkTable').find('tr').each(
      function() {
          var tdAttr =  $(this).find("td");
          var networkName = tdAttr.eq(0).text();
          var subnetType = tdAttr.eq(1).text();
          var size = tdAttr.eq(2).text();
          var preConfigured=tdAttr.eq(3).text();
          var subnet = tdAttr.eq(4).text();
          var gatewayIP = tdAttr.eq(5).text();
          var localIP=tdAttr.eq(6).text();
          var localInterface=tdAttr.eq(7).text();

          if( networkName != "" && subnetType !="") {
              networkStr += `
              <network>
                 <network-name>`+networkName+`</network-name>
                 <subnet-type>`+subnetType+`</subnet-type>
                 <size>`+size+`</size>
                 <pre-configured>`+preConfigured+`</pre-configured>`;
              if (preConfigured == "True") {
                networkStr +=` 
                  <subnet>`+subnet+`</subnet>
                  <gateway-ip>`+gatewayIP+`</gateway-ip>
                  <local-ip>`+localIP+`</local-ip>`;
              }
              //Only when networkName is nfx-wan0/1, contains localInterface
              if( networkName == 'nfx-wan0' || networkName=='nfx-wan1')
                  networkStr += `
                      <local-interface>`+localInterface+`</local-interface>`;
              
              networkStr += `       
               </network>`;
          }
      }
    );
    networkStr+=`
    </networks>`;
    //alert(networkStr);
    return networkStr;
}

function retrieveAllNetworkNames(){
    //alert("In retrieve");
    var networkNameStr=""
    
    $('#networkTable').find('tr').each(
      function() {
        var tdAttr =  $(this).find("td");
        var networkName = tdAttr.eq(0).text();
        networkNameStr += networkName;
      }
    );
    return networkNameStr;
}

function retrieveCPEBaseXML() {
            var cpeName = document.getElementById('cpe-name').value;
            var cmiPopLocation = document.getElementById('cmi-pop-location').value;
            var domainController = document.getElementById('domain-controller').value;
            var cpeAsNumber = document.getElementById('cpe-as-number').value;
            var  peAsNumber= document.getElementById('pe-as-number').value;
            var  peRouterName= document.getElementById('pe-router-name').value;
            var  deploymentTemplateName= document.getElementById('deployment-template-name').value;
            var customerType = document.getElementById('customer-type').value;
            var  customerUsername= document.getElementById('customer-username').value;
            var  customerPassword= document.getElementById('customer-password').value;

            var cpeBaseStr = `<cpe-name>`+cpeName+`</cpe-name> 
              <cmi-pop-locations> 
                <cmi-pop-location>
                <cmi-pop-location>`+cmiPopLocation+`</cmi-pop-location>
                </cmi-pop-location>
              </cmi-pop-locations> 
              <cpe-domain-controller> 
                <domain-controller>`+domainController+`</domain-controller> 
                <cpe-as-number>`+cpeAsNumber+`</cpe-as-number> 
                <pe-as-number>`+peAsNumber+`</pe-as-number> 
                <pe-router-name>`+peRouterName+`</pe-router-name> 
                <deployment-template-name>`+deploymentTemplateName+`</deployment-template-name> 
                <customer-type>`+customerType+`</customer-type> 
                <customer-username>`+customerUsername+`</customer-username> 
                <customer-password>`+customerPassword+`</customer-password> 
              </cpe-domain-controller>`;

            //alert(cpeBaseStr);
            return cpeBaseStr;
}

//Generate Customer CMI payload
function generateCustomerCMIPayload () {

    var customerName = document.getElementById('cust-name').value;
    var custCIDN = document.getElementById('cidn').value;
    var existingCustomerStatus = document.getElementById('existing-customer').value;
    var dedicatedCustomerContextStatus = document.getElementById('dedicated-customer-context').value;
    var primaryFirewallIP = document.getElementById('primary-firewall-ip').value;
    var sharedContentName = document.getElementById('shared-context-name').value;
    var dedicatedSecurityPolicyStatus = document.getElementById('dedicated-security-policy').value;
    var securityPolicy = document.getElementById('security-policy').value;
    var snmpCommunity = document.getElementById('snmp-community').value;

    var onboardCustomerCMIModelModelPayload = 
`<?xml version="1.0"?>
<per-customer-cmi-instance>
    <cust-name>`+customerName+`</cust-name>
    <cidn>`+custCIDN+`</cidn>
    <cmi-pop-locations>lonsdale</cmi-pop-locations>
    <existing-customer>`+existingCustomerStatus+`</existing-customer>
    <dedicated-customer-vrf>False</dedicated-customer-vrf>
    <is-firewall-deployed>True</is-firewall-deployed>
    <dedicated-customer-context>`+dedicatedCustomerContextStatus+`</dedicated-customer-context>
    <primary-firewall-ip>`+primaryFirewallIP+`</primary-firewall-ip>
    <shared-context-name>`+sharedContentName+`</shared-context-name>
    <dedicated-security-policy>`+dedicatedSecurityPolicyStatus+`</dedicated-security-policy>
    <security-policy>`+securityPolicy+`</security-policy>
    <snmp-community>`+snmpCommunity+`</snmp-community>
</per-customer-cmi-instance>
`;

            
    document.getElementById("customerCMIPayloadContent").value = onboardCustomerCMIModelModelPayload;

}

function generateCustomerCPEPayload() {
    var customerName = document.getElementById('cust-name').value;
    var custCIDN = document.getElementById('cidn').value;
    var onboardCustomerCPEModelModelPayload = 
`<?xml version="1.0"?>
<customer>
    <customer-name>`+customerName+`</customer-name>
    <cidn>`+custCIDN+`</cidn>
    <customer-sites/>
</customer>
`;

            
    document.getElementById("customerCPEPayloadContent").value = onboardCustomerCPEModelModelPayload;
   
}

function generateCustomerSiteCPEPayload () {

      // var customerNameSelect = $('#customerlist').find("option:selected").text();
      // var customerCidnSelect = $('#customerlist').val();
      var siteID = document.getElementById('site-id').value
      var siteName = document.getElementById('site-name').value
            var northboundSystem = $('#northbound-system').val();
            var street = $('#street').val();
            var city = $('#city').val();
            var zip = $('#zip').val();
            var state = $('#state').val();
            var country = $('#country').val();

      var onboardCustomerSiteToCPEModelModelPayload = 
`<?xml version="1.0"?>
<customer-site>
    <site-id>`+siteID+`</site-id>
    <site-name>`+siteName+`</site-name>
    <northbound-system>`+northboundSystem+`</northbound-system>
    <street>`+street+`</street>
    <city>`+city+`</city>
    <zip>`+zip+`</zip>
    <state>`+state+`</state>
    <country>`+country+`</country>
    <cpes/>
</customer-site>
`;

      
      //$('#selectedcustomertext').text("Onboard to Customer(CIDN): "+customerNameSelect+"("+customerCidnSelect+")");      
      document.getElementById("customerSiteCPEPayloadContent").value = onboardCustomerSiteToCPEModelModelPayload;

}

function generateCPECustomerSitePayload() {

    var onboardCPEToCustomerSitePayload = 
    `<?xml version="1.0"?>
     <cpe> 
       `+ retrieveCPEBaseXML()+
          retrieveAllDevices()+
          retrieveAllNetworks()+
       `
       <add-device-to-sciencelogic/>
  </cpe>`;

    
    //Set the target customer site text
    // var customerCidn = $('#customerlist').val();
    // var customerName = $('#customerlist').find('option:selected').text();
    // var siteId = $('#customersitelist').val();
    // var siteName = $('#customersitelist').find('option:selected').text();
    // var targetTxt = "Onboard to "+customerName+"("+customerCidn+") on "+siteName+"("+siteId+")";

    //$('#targetcustomersitetext').text(targetTxt);
    document.getElementById("cpeCustomerSitePayloadContent").value = onboardCPEToCustomerSitePayload;

}

function generateShipCPEPayload() {

    // var cidn = $('#customerlabel').val();
    // var siteId = $('#customersitelabel').val();
    // var cpeName = $('#CPElabel').text();
    var serialNumber = $('#serial-number').val();
    var activationCode = $('#activation-code').val();
    //alert(cidn+" "+siteId + " "+cpeName);
    // if(serialNumber.length<=0 || activationCode.length<=0){
    //   alert("Please fill both the Serial Number and Activation Code.");
    //   return;
    // }
    
        var shipCPEPayload = 
`<?xml version="1.0"?>
<ship-cpe>
    <serial-number>`+serialNumber+`</serial-number>
    <activation-code>`+activationCode+`</activation-code>
</ship-cpe>
`;

    document.getElementById("shipCPEPayloadContent").value = shipCPEPayload;

}

/** The common API calling function                                    */
/**  parameters: including all the parameters and payload for this API */
function callOnboardAPIs(operationName, APIUrl, parameters, showTaskIdDivId) {

    console.log("Call API for "+operationName);
    

    console.log("parameters are: ");
    console.log(parameters);

    $.post(APIUrl, parameters)
    .done(function( data ) {
      //alert(data);
      return refreshStatusDivBasedonPostResult(data, operationName, showTaskIdDivId);
    });



}

/* Used by all onboard/delete pages */
/* INPUT: postResult: taskId if success; otherwise, errormsg */
function refreshStatusDivBasedonPostResult ( postResult , operationString, showTaskIdDivId ) {

      var statusDiv = document.getElementById(showTaskIdDivId);

      //Set the taskId if success
      if (postResult.indexOf("Error")<0) {

        statusDiv.innerHTML = statusDiv.innerHTML + "<br />" + operationString +" called correctly. Task ID: "+ postResult;
        $('#savetaskid').val(postResult);
        //alert($('#savetaskid').val());
        return true;
      }
      else  {//output the error message
         statusDiv.innerHTML = statusDiv.innerHTML + operationString+" failed. Please check Task Detail.<br />" + postResult;
         return false;
     }

}

function monitorTaskStatus(statusTextDivId){


    console.log("monitorStatus method called");

    var taskid = $('#savetaskid').val();
    if (taskid.trim().length<=0) {
      alert("No Task ID has been generated! Please check the error! ");
      //Stop the interval and return 
      clearInterval(intervalId);
      return false;
    }

    $.post( "/php/monitorTask.php", { task_id: taskid}).done(function(data) {
      // alert( "Data Loaded: " + data );
      data = "TASK STATUS: IN_PROGRESS";
      if ( confirm("Task Finished? "))
        data = "TASK STATUS: COMPLETE | PERCENTAGE COMPLETION: 100";
      
      var statusDiv = document.getElementById(statusTextDivId);
      //If there are "Error" in returned data, stop interval, process and return false
      if( data.trim().indexOf('TASK STATUS: COMPLETE | PERCENTAGE COMPLETION: 100') >= 0) {
          //Stop interval and move to the next step
          alert("Success, move to next step.");
          statusDiv.innerHTML  = "<br />"+ data;
          clearInterval(intervalId);
          currentStep += 1;
          onboardProcess();
      }
      else {
          //If task is in "ERROR"
          if(data.trim().indexOf('Error') > 0 ) {
              alert("Error, stop and check.");
              statusDiv.innerHTML  =  "<br />"+ data + ". Please check the Task Detail.";
              currentStep = 0;
              clearInterval(intervalId);
              return false;
          }
          else //task is in IN_PROGRESS, continute to check status
          {
            statusDiv.innerHTML  ="<br />"+ data + "&nbsp;<img src='img/inprogress.gif' style='wideth: 30px; height: 30px'>";
            return;
          }
       }
    });
    
}


function closeAllinOneStatusDiv( ) {

  //Clear and close the Status div, saved task id
  // var statusDiv = document.getElementById("statustext");
  // statusDiv.innerHTML = "";
  $('#savetaskid').val();
  $('#showTaskIdOnboardCustomerCMI').empty();
  $('#statustextOnboardCustomerCMI').empty();
  $('#showTaskIdOnboardCustomerCPE').empty();
  $('#statustextOnboardCustomerCPE').empty();
  $('#showTaskIdOnboardCustomerSiteCPE').empty();
  $('#statustextOnboardCustomerSiteCPE').empty();
  $('#showTaskIdOnboardCPECustomerSite').empty();
  $('#statustextOnboardCPECustomerSite').empty();
  $('#showTaskIdShipCPE').empty();
  $('#statustextShipCPE').empty();

  document.getElementById('infoDiv').style.display = "none";
  document.getElementById('allInOnePanelGroup').style.display = "block";


}

function onboardProcess() {

  var customerCidn = $('#cidn').val();
  var siteId = $('#site-id').val();
  var cpeName = $('#cpe-name').val();

  var targetStatusTextElementId="";

  switch (currentStep) {
    case 0:
      //call the onboardCustomerCMI 
      var onboardCustomerCMIPayload = document.getElementById("customerCMIPayloadContent").value;

      var parameters = {customer_xml: onboardCustomerCMIPayload};
      if ( !callOnboardAPIs("Onboard Customer to CMI Model", "/php/onboard_customer_cmi.php",parameters,"showTaskIdOnboardCustomerCMI"));
        //return;
      targetStatusTextElementId = "statustextOnboardCustomerCMI";  
      break;

    case 1: 
      //call the onboardCustomerCPE 
      var onboardCustomerCPEPayload = document.getElementById("customerCPEPayloadContent").value;

      var parameters = {customer_xml: onboardCustomerCPEPayload};
      if ( !callOnboardAPIs("Onboard Customer to CPE Model", "/php/onboard_customer_cpe.php",parameters,"showTaskIdOnboardCustomerCPE"));
        //return;
      targetStatusTextElementId = "statustextOnboardCustomerCPE";  
      break;

    case 2: 
      //call the onboardCustomerSiteCPE 
      var onboardCustomerSiteCPEPayload = document.getElementById("customerSiteCPEPayloadContent").value;
      var parameters = {customer_cidn: customerCidn, customer_site_xml: onboardCustomerSiteCPEPayload};
      if ( !callOnboardAPIs("Onboard Customer Site to CPE Model", "/php/onboard_customer_site_cpe.php",parameters,"showTaskIdOnboardCustomerSiteCPE"));
        //return;
      targetStatusTextElementId = "statustextOnboardCustomerSiteCPE";  
      break;

    case 3:
      //call the onboardCPECustomerSite 
      var onboardCPECustomerSitePayload = document.getElementById("cpeCustomerSitePayloadContent").value;
      var parameters = {customer_cidn: customerCidn, site_id: siteId, cpe_xml: onboardCPECustomerSitePayload };
      if ( !callOnboardAPIs("Onboard CPE to Customer Site ", "/php/onboard_cpe_customer_site.php",parameters,"showTaskIdOnboardCPECustomerSite"));
        //return;
      targetStatusTextElementId = "statustextOnboardCPECustomerSite";  
      break;

    case 4:
      //call the shipCPE 
      var shipCPEPayload = document.getElementById("shipCPEPayloadContent").value;
      var parameters = {input_cidn: customerCidn, input_siteid: siteId, input_cpename: cpeName, input_xml: shipCPEPayload};
      if ( !callOnboardAPIs("Ship CPE ", "/php/ship_cpe.php",parameters,"showTaskIdShipCPE"));
        //return;
      targetStatusTextElementId = "statustextShipCPE";  
      break;

    default:
      currentStep = 0;
      return;
  }

  monitorTaskStatus(targetStatusTextElementId);
    
  //Set interval to check the result of 1st step
  intervalId = setInterval("monitorTaskStatus('"+targetStatusTextElementId+"');",5*1000);


}

