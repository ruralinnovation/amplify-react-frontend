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
                name: 'IAMIdentityCenter',
                metadata: {
                    metadataContent: 'https://portal.sso.us-east-1.amazonaws.com/saml/metadata/MzEyNTEyMzcxMTg5X2lucy0zNmJjM2EyOWEwMTQwMjAx', // '<your-url-hosting-saml-metadata>', or content of the metadata file
                    metadataType: 'URL', // 'URL' or 'FILE'
                }
            },
            callbackUrls: [
                'http://localhost:5173',
                'https://dev-saml-login.d14e2enocgl6n4.amplifyapp.com'
            ],
            logoutUrls: [
                'http://localhost:5173/',
                'https://dev-saml-login.d14e2enocgl6n4.amplifyapp.com/'
            ]
        }
    },
});
