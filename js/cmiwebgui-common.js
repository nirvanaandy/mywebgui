/* The common js file to import all the related js and css */
document.write('<script   src="js/jquery-3.1.1.min.js"   integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="   crossorigin="anonymous"></script>');
document.write('<script type="text/javascript" src="js/jquery.validate.js"></script>');
document.write('<script type="text/javascript" src="js/additional-methods.js"></script>');
document.write('<link rel="stylesheet" href="css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">');
document.write('<link rel="stylesheet" href="css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">');
document.write('<script src="js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>');

//Check if there is "username" and "authenticationstatus" in cookie. No: redirect to login.
if (window.location.href.indexOf("index.html") < 0 )
if (getCookie("authenticationstatus") == null && getCookie("authenticationstatus") != "Success")
      window.location = "/index.html";        


function genNavigateBar(){
document.getElementById("navigatebar").innerHTML = `  
  <div class="container-fluid">
    <div class="navbar-header">
      <table border="0"><tr>
      <td><a class="navbar-brand" href="/NCXHome.html">
        <img alt="Brand" src="img/logo.png" style="width: 30px; height: =100px;" >
      </a></td><td></td>
      <td><span style="vertical-align: bottom"><p style="font-family:arial;color:blue;font-size:20px;font-weight: bold;font-style: oblique;">CMI Web Interface</p></span></td>
      <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td>
        <div class="btn-group">
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">View
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu">
                <li>
                    <a href="/view_existing_customers_cmi_model.html">View Customer in CMI Model</a>
                </li>
                <li>
                    <a href="/view_existing_customers_cpe_model.html">View Customer in CPE Model</a>
                </li>
                <li>
                    <a href="/view_existing_customer_sites_in_cpe_model.html">View Customer Sites in CPE Model</a>
                </li>
                <li>
                    <a href="/view_existing_cpe_customer_sites.html">View CPEs at Customer Site</a>
                </li>
            </ul>
        </div>        
      </td>
      <td>&nbsp;&nbsp;</td>      
      <td>
      <div class="btn-group">
          <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Onboard
              <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" role="menu">
              <li>
                  <a href="/onetime_task.html">Onetime Tasks</a>
              </li>
              <li>
                  <a href="/create_firewall_context.html">Create Firewall Context</a>
              </li>
              <li class="divider"></li>          
              <li>
                  <a href="/onboard_customer_cmi_model.html">Onboard Customer to CMI Model</a>
              </li>
              <li>
                  <a href="/onboard_customer_cpe_model.html">Onboard Customer to CPE Model</a>
              </li>
              <li>
                  <a href="/onboard_customer_site_to_cpe_model.html">Onboard Customer Site to CPE Model</a>
              </li>
              <li>
                  <a href="/onboard_cpe_to_customer_site.html">Onboard CPE to Customer Site</a>
              </li>
              <li>
                  <a href="/ship_cpe.html">Ship CPE</a>
              </li>
              <li class="divider"></li>
              <li>
                  <a href="/all_in_one.html">All_in_One Onboard</a>
              </li>
          </ul>
      </div>        
      </td>
      <td>&nbsp;&nbsp;</td>
      <td width="40%">
        <div class="btn-group">
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Decommission
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu">
                <li>
                    <a href="/delete_cpe_customer_site.html">Delete CPEs at Customer Site</a>
                </li>
                <li>
                    <a href="/delete_customer_site_cpe_model.html">Delete Customer Site in CPE Model</a>
                </li>
                <li>
                    <a href="/delete_customer_cpe_model.html">Delete Customer in CPE Model</a>
                </li>
                <li>
                    <a href="/delete_customer_cmi_model.html">Delete Customer in CMI Model</a>
                </li>
            </ul>
        </div>        
      </td>
      <td><img alt="User:" src="img/usericon.png" style="width: 30px; height: 30px;"></td><td width="2%"></td>
      <td><p style="font-family:arial;color: black;font-size: 15px;font-weight: bold">`+getCookie("username")+`</p></td>
      <td width="1%"></td>
      <td><a href="/php/retrievelogs.php" target="_new"><img alt="Logs" title="Retrive logs" src="img/logicon.jpg" style="width: 30px; height: 30px;"></a></td>
      <td width="5%"></td>
      <td><a href="/index.html" onclick="clearLogin();"><img alt="Logout" title="Logout" src="img/logout.png" style="width: 30px; height: 30px;"></a></td>
      </tr>
      </table>
    </div>
  </div>

	`;
}


/* This function is used to set cookies */
function setCookie(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
}

/* This function is used to get cookies */
function getCookie(name) {
    var prefix = name + "=";
    var start = document.cookie.indexOf(prefix);

    if (start == -1) {
        return null;
    }

    var end = document.cookie.indexOf(";", start + prefix.length);
    if (end == -1) {
        end = document.cookie.length;
    }

    var value = document.cookie.substring(start + prefix.length, end);
    return unescape(value);
}

/* This function is used to delete cookies */
function deleteCookie(name, path, domain) {
    if (getCookie(name)) {
        document.cookie = name + "=" +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-1970 00:00:01 GMT";
    }
}

//Clear the login infor when click logout
function clearLogin() {
    deleteCookie("username");
    deleteCookie("authenticationstatus");
}