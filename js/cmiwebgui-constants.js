//Consts for the tooltips for all fields
var createFireWallTips = {
	"primary-asa-ip": "valid IPv4 address",	
	"context-name": "alphanumeric, -/dash and _/underline, max length: 20",
	"context-inside-ip": "valid IPv4 address",
	"context-outbound-nexthop-ip": "valid IPv4 address"	
};

var onboardCustomerCMITips = {
	"cust-name": "3 lowercase or 3 uppercase letters",
	"cidn": "10 digits",
	"primary-firewall-ip": "valid IPv4 address",
	"shared-context-name": "alphanumeric, -/dash and _/underline, max length: 20"
};

var onboardCustomerCPETips = {
	"customer-name": "3 lowercase or 3 uppercase letters",
	"cidn": "10 digits"
};

var onboardCustomerSiteCPETips = {
	"site-id": "alphanumeric, -/dash and _/underline, max length: 50",
	"site-name": "max length: 100",
	"street": "max length: 50",
	"city": "letters only, max length: 50",
	"zip": " 4 digits",
	"state": "letters only, max length: 20",
	"country": "letters only, max length: 30"
};

var onboardCPECustomerSiteTips = {
	"cpe-name": "alphanumeric, -/dash and _/underline, max length: 100",
	"cmi-pop-location": "alphanumeric, max length: 100",
	"domain-controller": "alphanumeric, -/dash and _/underline, max length: 100",
	"cpe-as-number": "digits, max length: 6",
	"pe-as-number": "digits, max length: 6",
	"pe-router-name": "alphanumeric, -/dash and _/underline, max length: 20",
	"customer-username": "Do not use admin/Administrator like names, max length: 50",
	"customer-password": "max length: 20",
	"device-name": "alphanumeric, -/dash and _/underline, max length: 100",
	"subnet-type": "Subnet Type must match with Network Name. must be: nfx-oam -> CPEMGMT, nfx-wan0/1 -> CPEWAN, nfx-lan -> CPELAN.",
	"size": "digits, max length: 10",
	"gateway-ip": "valide IPv4 address",
	"local-ip": "valide IPv4 address",
	"subnet":  "valide IPv4 subnet mask address, e.g. 10.21.112.0/80",
	"local-interface": "Must be WAN_0 for nfx-wan0, WAN_1 for nfx-wan1, otherwise empty.",
	"pre-configured": "When select Ture, please provide Subnet, Gateway IP, and local IP."
};

var shipCPETips = {
	"serial-number": "alphanumeric, max length: 100",
	"activation-code": "alphanumeric, max length: 100"
};

