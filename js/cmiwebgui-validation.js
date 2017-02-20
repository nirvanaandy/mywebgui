/** 
 * Start the input validation code  *
 */
$.validator.setDefaults({
    // submitHandler: function() {
    //   alert("submit!");
    // }
    debug: true,
    success: "valid"
});

//Add extra validation functions
//For customerName 3 lowercase or 3 uppercase Letters
$.validator.addMethod("customername3",function(value,element){
    var regex = "^([a-z]{3}|[A-Z]{3})$";
    regex = new RegExp(regex);
    return this.optional(element) || regex.test(value);
},"Please input 3 lowercase or 3 uppercase letters.");

//For CIDN, 10 digits
$.validator.addMethod("digits10",function(value,element){
    var regex = "^[0-9]{10}$";
    regex = new RegExp(regex);
    return this.optional(element) || regex.test(value);
},"Please input 10 digits.");


//For ACS policy/security policy, when Dedicated Security Policy is true, this should be filled
$.validator.addMethod("acsPolicy",function(value,element){
    var dedicatedPolicy = $('#dedicated-security-policy').val();
    if ( dedicatedPolicy == "True" && value.trim().length == 0)
      return false;
    else
      return true;
},"This field should be filled when Dedicated Security Policy is True.");

//For Site Id, alphanumeric
$.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^\w+$/i.test(value);
}, "Letters and numbers only please.");

//For only letters
$.validator.addMethod("onlyletters",function(value,element){
    var regex = "^[a-zA-Z]+$";
    regex = new RegExp(regex);
    return this.optional(element) || regex.test(value);
},"Letters only please.");

//Alphanumeric plus '-'
$.validator.addMethod("alphanumericHyphen",function(value,element){
    var regex = "^[0-9a-zA-Z-_]+$";
    regex = new RegExp(regex);
    return this.optional(element) || regex.test(value);
},"Alphanumeric and dash(-)/underline(_) only please.");

//validate the consistency between networkName and subnetType
$.validator.addMethod("subnettypecheck",function(value,element){
    var networkName = $('#network-name').val();
    if ( networkName=='nfx-oam' && value != 'CPEMGMT')
        return false;
    if ( (networkName=='nfx-wan0' || networkName=='nfx-wan1') && value != 'CPEWAN')
        return false;
    if ( networkName=='nfx-lan' && value != 'CPELAN')
        return false;

    return true;
},"Inconsistent, must be: nfx-oam -> CPEMGMT, nfx-wan0/1 -> CPEWAN, nfx-lan -> CPELAN.");

//validate the consistency between networkName and local Interface
$.validator.addMethod("localinterfacecheck",function(value,element){
    var networkName = $('#network-name').val();
    if ( networkName=='nfx-wan0' && value != 'WAN_0')
        return false;
    if ( networkName=='nfx-wan0' && value != 'WAN_1')
        return false;

    return true;
},"Inconsistent, must be: nfx-wan0 -> WAN_0, nfx-wan1 -> WAN_1.");

$.validator.addMethod("ipv4", function(value, element) {
    return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
}, "Please enter a valid IPv4 address.");

//IPv4 Subnet Check
$.validator.addMethod("subnetipv4", function(value, element) {
    return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\/(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
}, "Please enter a valid IPv4 subnet.");


$.validator.addMethod("usernamevalidate",function(value,element){
    if ( value == 'admin' || value == 'Administrator')
        return false;

    return true;
},"Please do not use admin/Administrator");


/** The validation rules for each form */
var createFirewallContextRules = function (modelForm)
 {
modelForm.validate( {
  rules: {
      'primary-asa-ip': { 
          required: true,
          ipv4 : true},
      'context-name': {
          required: true,
          maxlength: 20,
          alphanumericHyphen: true
       },
       'context-inside-ip': {
          required: true,
          ipv4 : true
       },
       'context-outbound-nexthop-ip': {
          required: true,
          ipv4 : true
       }

  }
});

};


var onboardCustomerOnCMIRules = function(modelForm){
    modelForm.validate( {
      rules: {
          'cust-name': {
             required: true,
             customername3: true},
          'cidn': {
            required: true,
            digits10: true
          },
          'primary-firewall-ip': {
            required: true,
            ipv4: true
          },
          'security-policy': { acsPolicy: true }
      }
      });

};


var onboardCustomerOnCPERules = function(modelForm){
    modelForm.validate( {
      rules: {
          'customer-name': {
            required: true,
            customername3: true},
           cidn: {
            required: true,
            digits10: true
          }
      }
      });

};

var onboardCustomerSiteCPERules = function(modelForm){
modelForm.validate( {
  rules: {
      'site-id': {
        required: true, 
        alphanumericHyphen: true,
        maxlength: 50 },
      'site-name': {
        required: true,
        maxlength: 100
      },
      street: { 
        maxlength: 50 
      },
      city: { 
        onlyletters: true,
        maxlength: 50 
      },
      zip: {
        digits: true,
        minlength: 4,
        maxlength: 4
      },
      state: {
        onlyletters: true,
        maxlength: 20         
      },
      country: {
        onlyletters: true,
        maxlength: 30         
      }
  }
  });

};

var onboardCPECustomerSiteRules = function(modelForm){
    modelForm.validate( {
      rules: {
          'cpe-name': { 
            alphanumericHyphen: true,
            maxlength: 100 
          },
          'cmi-pop-location': {
            required: true,
            alphanumeric: true,
            maxlength: 100
          },
          'domain-controller': {
            required: true,
            alphanumericHyphen: true,
            maxlength: 100
          },
          'cpe-as-number': {
            required: true,
            digits: true,
            maxlength: 6
          },
          'pe-as-number': {
            required: true,
            digits: true,
            maxlength: 6
          },
          'pe-router-name':{
            alphanumericHyphen: true,
            maxlength: 20
          },
          'customer-username': {
            usernamevalidate: true,
            maxlength: 50
          },
          'customer-password': {
            maxlength: 20
          },
          'device-name': {
            required: true,
            alphanumericHyphen: true,
            maxlength: 100
          },
          'subnet-type': {
            subnettypecheck: true 
          },
          'size': {
            required: true,
            digits: true,
            maxlength: 10
          },
          'gateway-ip': {
            ipv4: true
          },
          'local-ip': {
            ipv4: true
          },
          'subnet': {
            subnetipv4: true
          }

       }
    });

};

var shipCPERules = function(modelForm){
    
    modelForm.validate( {
      rules: {
        'serial-number': {
            required: true,
            alphanumeric: true,
            maxlength: 100
        },
        'activation-code': {
            required: true,
            alphanumeric: true,
            maxlength: 100
        }
      }
    });

};