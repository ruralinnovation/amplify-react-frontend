import {defineAuth} from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
    loginWith: {
        email: true,
        externalProviders: {
            saml: {

//                 name: 'MyCalixStaging',
//                 metadata: {
//                   metadataContent: // '<your-url-hosting-saml-metadata>', or content of the metadata file
// `<?xml version="1.0" encoding="UTF-8"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://calix.my.salesforce.com" validUntil="2035-03-01T02:53:21.436Z" xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
//    <md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
//       <md:KeyDescriptor use="signing">
//          <ds:KeyInfo>
//             <ds:X509Data>
//                <ds:X509Certificate>MIIEjTCCA3WgAwIBAgIOAZTZDHbLAAAAAFvpcfwwDQYJKoZIhvcNAQELBQAwgYYxHjAcBgNVBAMMFVNlbGZTaWduZWRDZXJ0MjAyNTAwMTEYMBYGA1UECwwPMDBENzAwMDAwMDBKY00yMRcwFQYDVQQKDA5TYWxlc2ZvcmNlLmNvbTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzELMAkGA1UECAwCQ0ExDDAKBgNVBAYTA1VTQTAeFw0yNTAyMDYwMjE3NDBaFw0yNjAyMDYwMDAwMDBaMIGGMR4wHAYDVQQDDBVTZWxmU2lnbmVkQ2VydDIwMjUwMDExGDAWBgNVBAsMDzAwRDcwMDAwMDAwSmNNMjEXMBUGA1UECgwOU2FsZXNmb3JjZS5jb20xFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xCzAJBgNVBAgMAkNBMQwwCgYDVQQGEwNVU0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCsSl3gz0iW3wbsXvIi8yG4OFS0IN1pcQWsNKvO7EkFJPyLY9kcwHfLlNcLz6F/WJRAy3RwiW5/gM8ONujqp7JZgWizvgBPaLxqAIeqbtnsWcufePXYmoDmyrme17s8RGY04fGqN5ZjckPi6Dgtb9D/6rwSw1xdkp0zK8qXBaJkqUdiygF4HrCiMO2rK6d3qxpNSnVgFQ+DYaQ44yeUC3OBykHXzp8JfgftrV3OTiGOtO8F+bNCJvSAUU3lgtdbjxsxPnXhTIVvt4KpWc4k05K4Pq/lbaJ+DutK6smrBYdivnv1z2gsXXnxlMxWC5WfcbR8eUFyqTQLi/J+jwhtabZxAgMBAAGjgfYwgfMwHQYDVR0OBBYEFM2sVPNJxDsBv3IaUlPy4n5AqTxeMA8GA1UdEwEB/wQFMAMBAf8wgcAGA1UdIwSBuDCBtYAUzaxU80nEOwG/chpSU/LifkCpPF6hgYykgYkwgYYxHjAcBgNVBAMMFVNlbGZTaWduZWRDZXJ0MjAyNTAwMTEYMBYGA1UECwwPMDBENzAwMDAwMDBKY00yMRcwFQYDVQQKDA5TYWxlc2ZvcmNlLmNvbTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzELMAkGA1UECAwCQ0ExDDAKBgNVBAYTA1VTQYIOAZTZDHbLAAAAAFvpcfwwDQYJKoZIhvcNAQELBQADggEBAA0HyWYkc4txXRi9T6KR9lk80dyyUZVJDF6fb2/hc4DxVXp/sUG4kullQyucqhbHOjIJJHovV0UvF8HO0veGR1p7OaU1damSoUV7hUahdtLC5Jt7y3xuqjTWs58eS/j0xi2KCLnxHYTNO0fXNTLe/L9vb3rlZKCSabQVa4EjM4CQrSX9cUlobkQUvq2m0icPdWgzGnZYo6ngH84GzmV4Od92ZEM1HAaPdnB4keWCgVbRqUB4i5bbAPwmLMO3zeufTHgPttAI3xztx9lhXjo1r+20LCxSi+rBP2e2R6hX8C+VY0nINmTCbAM0eLhVhOuomllL1g/WbvNOYbUS4o9n2d4=</ds:X509Certificate>
//             </ds:X509Data>
//          </ds:KeyInfo>
//       </md:KeyDescriptor>
//       <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
//       <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://calix--sfuat.sandbox.my.site.com/idp/endpoint/HttpPost"/>
//       <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://calix--sfuat.sandbox.my.site.com/idp/endpoint/HttpRedirect"/>
//    </md:IDPSSODescriptor>
// </md:EntityDescriptor>
// `,
//                   metadataType: 'FILE', // 'URL' or 'FILE'
//                 },

                name: 'IAMIdentityCenter',
                metadata: {
                    metadataContent: 'https://portal.sso.us-east-1.amazonaws.com/saml/metadata/MzEyNTEyMzcxMTg5X2lucy0zNmJjM2EyOWEwMTQwMjAx', // '<your-url-hosting-saml-metadata>', or content of the metadata file
                    metadataType: 'URL', // 'URL' or 'FILE'
                },
//                 metadata: {
//                     metadataContent: // '<your-url-hosting-saml-metadata>', or content of the metadata file
// `<?xml version="1.0" encoding="UTF-8"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://portal.sso.us-east-1.amazonaws.com/saml/assertion/MzEyNTEyMzcxMTg5X2lucy00NGE2OTQ1OTUwMWU3Mzdk">
//   <md:IDPSSODescriptor WantAuthnRequestsSigned="false"
//                        protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
//     <md:KeyDescriptor use="signing">
//       <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
//         <ds:X509Data>
//           <ds:X509Certificate>
//             MIIDBjCCAe6gAwIBAgIEVprafTANBgkqhkiG9w0BAQsFADBFMRYwFAYDVQQDDA1hbWF6b25hd3MuY29tMQ0wCwYDVQQLDARJREFTMQ8wDQYDVQQKDAZBbWF6b24xCzAJBgNVBAYTAlVTMB4XDTI1MDMxNzE0NTAwNloXDTMwMDMxNzE0NTAwNlowRTEWMBQGA1UEAwwNYW1hem9uYXdzLmNvbTENMAsGA1UECwwESURBUzEPMA0GA1UECgwGQW1hem9uMQswCQYDVQQGEwJVUzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMcPRd8CLvg7duqksykDmeIDV39zBHWUIH4AJhh4Bt1SU4A3XvH/nsgeHiTaxcLwTFJYyIH8Qf8YthBqj3wsHlK+GjcGuDKzWqim5zp3jF0gBSIYpTO66IUIRUw8HGR98FuLj+HLz9/mgyH8nm9LlopStnmahfcZ/b93dNUhiL9/au+86AivBy74m5LgnbaWV28hbp1YV1E8JQ6dHyecYeFduFDDTUNuLIt4qJXcZ2JnoVtwDNe7WBm8wk9UnQxx8BhYvkQJFaRY4bX/b/ZzNCRH5HZ0n4foy8za4kIteMa+QwERY4ZrJVRruqcbvD/FzWgxfHZ2FKXLdiKrYu6YlYUCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAjLXqtNGmVnYwrVBERS7E2yjWKLQZfnJUrOPLHdUxxaDqCyxsIwNWxdx5IZxWYIr1oG2VdppK+WVtqJQBOScsP5B0cfCMrQpy6EpwZatSBoCqb5jDOn27+X7miPJbjrGYTmJfjfO19pUyHl1D5k+3QeGZ+T4N1nMQFtWLPAkdYaXLt7IVuEhs27dMVk7Uh5erh4fy9J3VxlUgUVrs3YCK1IeAMzhN2PLYrjiOMBteZpQwsNRNFgOtP4smJW1wpzkoZvcHQ2U8cls7xRDIqyOb4xwYo3UFKyBWq/WqPjpfAgn7FTbTz/1sz31e96IEfkRTPaoMqzj7gDSLH6stazun4w==
//           </ds:X509Certificate>
//         </ds:X509Data>
//       </ds:KeyInfo>
//     </md:KeyDescriptor>
//     <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
//                             Location="https://portal.sso.us-east-1.amazonaws.com/saml/logout/MzEyNTEyMzcxMTg5X2lucy00NGE2OTQ1OTUwMWU3Mzdk"/>
//     <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
//                             Location="https://portal.sso.us-east-1.amazonaws.com/saml/logout/MzEyNTEyMzcxMTg5X2lucy00NGE2OTQ1OTUwMWU3Mzdk"/>
//     <md:NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:transient</md:NameIDFormat>
//     <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
//                             Location="https://portal.sso.us-east-1.amazonaws.com/saml/assertion/MzEyNTEyMzcxMTg5X2lucy00NGE2OTQ1OTUwMWU3Mzdk"/>
//     <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
//                             Location="https://portal.sso.us-east-1.amazonaws.com/saml/assertion/MzEyNTEyMzcxMTg5X2lucy00NGE2OTQ1OTUwMWU3Mzdk"/>
//   </md:IDPSSODescriptor>
// </md:EntityDescriptor>
// `,
//                     metadataType: 'FILE', // 'URL' or 'FILE'
//                 },

            },
            callbackUrls: [
                'http://localhost:5173',
            ],
            logoutUrls: [
                'http://localhost:5173/',
            ]
        }
    },
});
