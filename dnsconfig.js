// Providers

var REG_OVH = NewRegistrar('ovh', 'OVH');
var OVH = NewDnsProvider('ovh', 'OVH');

// Common configurations

var WEBSERVER_IPV4 = '51.77.136.165';

var MAILSERVER_CONFIG = [
    MX('@', 1, 'mx1.mail.ovh.net.'),
    MX('@', 5, 'mx2.mail.ovh.net.'),
    MX('@', 100, 'mx3.mail.ovh.net.'),
    TXT('@', 'v=spf1 include:mx.ovh.com ~all') // SPF
];

// Defaults

DEFAULTS(DefaultTTL('1h'), NAMESERVER_TTL('1h'));

// Domains

D('arbre.app', REG_OVH, DnsProvider(OVH),
    // Web
    A('@', WEBSERVER_IPV4), // Main site
    CNAME('www', '@'),
    A('insee', WEBSERVER_IPV4), // API
    A('mon', WEBSERVER_IPV4), // SPA

    // E-mails
    MAILSERVER_CONFIG,

    // Domain verification
    TXT('@', 'google-site-verification=puDIPKS7zzfTDbPwv3lMxp8b-LtmTa401GLLE8EdvEU'), // Google
    TXT('_github-challenge-arbre-app', 'cdda641101') // GitHub
);
