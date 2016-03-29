var express = require('express');
var fs = require('fs');
var https = require('https');
var clientCertificateAuth = require('client-certificate-auth');
 
var opts = {
  // Server SSL private key and certificate 
  key: fs.readFileSync('ca.key'),
  cert: fs.readFileSync('ca.crt'),
  // issuer/CA certificate against which the client certificate will be 
  // validated. A certificate that is not signed by a provided CA will be 
  // rejected at the protocol layer. 
  ca: fs.readFileSync('ca.crt'),
  // request a certificate, but don't necessarily reject connections from 
  // clients providing an untrusted or no certificate. This lets us protect only 
  // certain routes, or send a helpful error message to unauthenticated clients. 
  requestCert: true,
  rejectUnauthorized: false
};
 
var app = express();
 
// add clientCertificateAuth to the middleware stack, passing it a callback 
// which will do further examination of the provided certificate. 
app.use(clientCertificateAuth(checkAuth));
// app.use(app.router);
app.use(function(err, req, res, next) { console.log(err); next(); });
 
app.get('/', function(req, res) {
  res.send('Authorized!');
});
 
var checkAuth = function(cert) {
 /*
  * allow access if certificate subject Common Name is 'Doug Prishpreed'.
  * this is one of many ways you can authorize only certain authenticated
  * certificate-holders; you might instead choose to check the certificate
  * fingerprint, or apply some sort of role-based security based on e.g. the OU
  * field of the certificate. You can also link into another layer of
  * auth or session middleware here; for instance, you might pass the subject CN
  * as a username to log the user in to your underlying authentication/session
  * management layer.
  */
  return cert.subject.CN === 'test.apicasystem.com';
};
 
https.createServer(opts, app).listen(8443);
