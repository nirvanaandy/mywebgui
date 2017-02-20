//The common functions used by onboard,delete pages
//Attention: the corresponding html elements must use the same ID!!

function monitorStatusFunction(){

    console.log("monitorStatus button pressed");

    var taskid = $('#savetaskid').val();
    if (taskid.trim().length<=0) {
      alert("No Task ID has been generated!");
      return;
    }

    $.post( "/php/monitorTask.php", { task_id: taskid}).done(function(data) {
     // alert( "Data Loaded: " + data );
     var statusDiv = document.getElementById("statustext");
     statusDiv.innerHTML  = statusDiv.innerHTML + "<br />"+ data;
     //$('#closestatusdivbtn').show();
    });
    
}

function gettaskdetail() {
    console.log("Get Task Detail Button pressed");
    var taskid = $('#savetaskid').val();
    if (taskid.length<=0) {
      alert("No Task ID has been generated!");
      return;
    }
    var url = "/php/gettaskdetails.php?task_id="+taskid;
    window.open(url,"_blank");
}

/* Used by all onboard/delete pages */
/* INPUT: postResult: taskId if success; otherwise, errormsg */
function refreshStatusDivBasedonPostResult ( postResult , operationString ) {

      var statusDiv = document.getElementById("statustext");

      //Set the taskId if success
      if (postResult.indexOf("Error")<0) {

        statusDiv.innerHTML = statusDiv.innerHTML + "<br />" + operationString +" called correctly. Task ID: "+ postResult;
        $('#savetaskid').val(postResult);
        //alert($('#savetaskid').val());
      }
      else  //output the error message
         statusDiv.innerHTML = statusDiv.innerHTML + operationString+" failed. <br />" + postResult;

}

/* This is used by all the delete pages  */
/* When task finished, close status, go back to delete page*/
function closeStatusDiv() {
     //If there is no close button, then create one
     var statusDiv = document.getElementById("statustext");

     document.getElementById('infoDiv').style.display = "none";
     statusDiv.innerHTML  = "";
     //Refresh the customertable. Temporarily, reload the page
     location.reload(false);

}

/* This is used by all the onboard pages        */
/* When task finished or failed, close status   */
/* And go back to the input form                */
function closeStatusDivOnboard( formName ) {

  //Clear and close the Status div, saved task id
  var statusDiv = document.getElementById("statustext");
  statusDiv.innerHTML = "";
  $('#savetaskid').val();

  document.getElementById('infoDiv').style.display = "none";
  document.getElementById(formName).style.display = "block";

}

/* Get the customer list on CMI Model and create customer table */
/* Used by View/Delete Customer on CMI Model  */
/* INPUT: operationFlag: "view" "delete"      */
function refresh_customer_cmi_table ( operationFlag ){

    $.post("/php/get_customer_cmi.php").done(function(data){
      //alert(data);
      //Then analyse the xml, construct the table.
      var xmlDoc = $.parseXML(data);
      $(xmlDoc).find("per-customer-cmi-instance").each( function () {
      
	      var custname = $('cust-name',this).text();
	      var cidn=$('cidn',this).text();
	      var trStr = '<tr><td>'+custname+"</td><td>"+cidn+"</td><td>";

	      if ( operationFlag == "view") {
		      trStr = trStr + '<button type="button" name="'+custname+'" id="'+cidn+'" >View</button></td></tr>';
		      
		      $('#customertable').append(trStr);
		      $('#'+cidn).on('click',function(){
		         alert("Show the detail of customer: "+$(this).attr('name')+"("+$(this).attr('id')+")");
		      });
		  }
		  else if ( operationFlag == "delete"){
  	          trStr = trStr + '<button type="button" name="'+custname+'" id="'+cidn+'" >Delete</button></td></tr>';
         
	          $('#customertable').append(trStr);
	          $('#'+cidn).on('click',function(){
	             delcustomer($(this).attr('id'),$(this).attr('name'));
	          });
		  }
      });
  
    });

}


/* Get the customer list on CPE Model and create customer table */
/* Used by View/Delete Customer on CPE Model  */
/* INPUT: operationFlag: "view" "delete"      */
function refresh_customer_cpe_table ( operationFlag ){


    $.post("/php/get_customer_cpe.php").done(function(data){
      //alert(data);
      //Then analyse the xml, construct the table.
      var xmlDoc = $.parseXML(data);
      $(xmlDoc).find("customer").each( function () {
      
	      var custname = $('customer-name',this).text();
	      var cidn=$('cidn',this).text();
	      var trStr = '<tr><td>'+custname+"</td><td>"+cidn+"</td><td>";

	      if ( operationFlag == "view") {
		      trStr = trStr + '<button type="button" name="'+custname+'" id="'+cidn+'" >View</button></td></tr>';
		      
		      $('#customertable').append(trStr);
		      $('#'+cidn).on('click',function(){
		         alert("Show the detail of customer: "+$(this).attr('name')+"("+$(this).attr('id')+")");
		      });
		  }
		  else if ( operationFlag == "delete"){
		  	  trStr = trStr + '<button type="button" name="'+custname+'" id="'+cidn+'" >Delete</button></td></tr>';
      
      		  $('#customertable').append(trStr);
              $('#'+cidn).on('click',function(){
                 delcustomer($(this).attr('id'),$(this).attr('name'));
      		  });
		  }
      });
  
    });

}


/* Get the customer list on CPE and fill into customer listbox */
/* Used by View/Delete Customer Site on CPE and CPE on Customer Site */
function get_customer_cpe_fill_listbox (){
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

}

/* Based on the selected customer, refresh the Cusotmer Site table */
/* Used by view/Delete Customer Site on CPE */
/* INPUT: operationFlag: "delete" or "view" */
function enquireCustomerSiteRefreshSiteTable( operationFlag ){
    
    var cidn = $('#customerlist').val();
    var customerName = $('#customerlist').find('option:selected').text();
    //alert(customerName + ":"+cidn);
    //Empty the cusotmer site table
    $('#customersitetable tbody').empty();
    $('#customersitetable tbody').append('<tr><th>Customer Site Name</th><th>Customer Site ID</th></tr>');
    $.post("/php/get_customer_site_cpe.php",{ cidn: cidn }).done(function(data){
      //alert(data);
      //Then analyse the xml, build the site table
      var xmlDoc = $.parseXML(data);
      $(xmlDoc).find("customer-site").each( function () {
      
          var siteName = $('site-name',this).text();
          var siteId=$('site-id',this).text();

          var trStr = '<tr><td>'+siteName+"</td><td>"+siteId+"</td><td>";
          if ( operationFlag == 'view') {
	          trStr = trStr + '<button type="button" name="'+siteName+'" id="'+siteId+'" >View</button></td></tr>';
	          
	          $('#customersitetable tbody').append(trStr);
	          $('#'+siteId).on('click',function(){
	             alert("Show the detail of customer site: "+$(this).attr('name')+"("+$(this).attr('id')+")");
	          });
	      } 
	      else if (operationFlag == "delete" ) {
   	          trStr = trStr + '<button type="button" name="'+siteName+'" id="'+siteId+'" >Delete</button></td></tr>';
        
	          $('#customersitetable tbody').append(trStr);
	          $('#'+siteId).on('click',function(){
	             delCustomerSite($(this).attr('id'),$(this).attr('name'));
	          });
	      }

      });
    });
  
}

/* Based on the selected customer, refresh the Cusotmer Site listbox */
/* Used by view/Delete CPE on Customer Sites */

function enquireCustomerSiteRefreshSiteListbox(){
    
    var customerCidn = $('#customerlist').val();
    var customerName = $('#customerlist').find('option:selected').text();
    //alert(customerName + ":"+customerCidn);
    if( customerName.length <=0 || customerCidn === null)
    	return;
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



}


/* Based on the selected customer, SiteId refresh the CPE table */
/* Used by view/Delete CPE on Customer Sites */
/* INPUT: operationFlag: "view" "delete" "ship"     */

function enquireCPERefreshCPETable(operationFlag) {
    var cidn = $('#customerlist').val();
    var customerName = $('#customerlist').find('option:selected').text();
    var siteId = $('#customersitelist').val();
    var siteName = $('#customersitelist').find('option:selected').text();

    if (  cidn === null || customerName.length <= 0) {
      alert("Please select the Customer !");
      return;
    }

    if ( siteId === null || siteName.length<=0) {
      alert("Please select the Customer Site!");
      return;
    }
    //alert(customerName + ":"+cidn);
    //Empty the cpe table
    $('#cpetable tbody').empty();
    $('#cpetable tbody').append('<tr><th>CPE Name</th><th></th></tr>');
    $.post("/php/get_cpe_customer_site.php",{ input_cidn: cidn, input_siteid: siteId }).done(function(data){
      //alert(data);
      //Then analyse the xml, build the site table
      var xmlDoc = $.parseXML(data);
      $(xmlDoc).find("cpe").each( function () {
      
          var cpeName = $('cpe-name',this).text();

          var trStr = '<tr><td>'+cpeName+"</td><td>";
          if ( operationFlag == 'view') {
            trStr = trStr + '<button type="button" name="'+cpeName+'" id="'+cpeName+'" >View</button></td></tr>';
            
            $('#cpetable tbody').append(trStr);
            $('#'+cpeName).on('click',function(){
               alert("Show the detail of CPE: "+$(this).attr('id'));
            });
        } 
        else if (operationFlag == "delete" ) {
            trStr = trStr + '<button type="button" name="'+cpeName+'" id="'+cpeName+'" >Delete</button></td></tr>';
        
            $('#cpetable tbody').append(trStr);
            $('#'+cpeName).on('click',function(){
               delCPE($(this).attr('id'));
            });
        } 
        else if (operationFlag == "ship" ) {
            trStr = trStr + 'Not Done</td><td><button type="button" name="'+cpeName+'" id="'+cpeName+'" >Ship</button></td></tr>';
        
            $('#cpetable tbody').append(trStr);
            $('#'+cpeName).on('click',function(){
               shipCPE($(this).attr('id'));
            });
        } 


      });
    });

}
