const vite_env_test = {
    ...import.meta.env
}

console.log("VITE ENV TEST: ", vite_env_test);

const aws_config = {
    "aws_project_region": `${import.meta.env.VITE_REGION}`,
    "Auth": {
        "domain": `${import.meta.env.VITE_COGNITO_DOMAIN}`,
        "clientId": `${import.meta.env.VITE_USER_POOL_CLIENT_ID}`,
        "identityPoolId": `${import.meta.env.VITE_IDENTITY_POOL_ID}`,
        "identityPoolRegion": `${import.meta.env.VITE_REGION}`,
        "region": `${import.meta.env.VITE_REGION}`,
        "userPoolId": `${import.meta.env.VITE_USER_POOL_ID}`,
        "userPoolWebClientId": `${import.meta.env.VITE_USER_POOL_CLIENT_ID}`,
        "oauth": {
            "domain": `${import.meta.env.VITE_COGNITO_DOMAIN}`,
            // "scope": [ "email", "profile", "openid", "aws.cognito.signin.user.admin" ],
            // "scope": [ "email", "openid", "profile" ],
            // "scope": [ "email" ],
            "scope": [ "openid" ],
            "redirectSignIn": window.location.protocol + "//" + window.location.hostname + ((!!window.location.port) ? ":" + window.location.port : "" ), //`${import.meta.env.VITE_COGNITO_REDIRECT_SIGNIN}`,
            "redirectSignOut": window.location.protocol + "//" + window.location.hostname + ((!!window.location.port) ? ":" + window.location.port : "" ) + "/", // `${import.meta.env.VITE_COGNITO_REDIRECT_SIGNOUT}`,
            "responseType": "code"  // or "token", note that REFRESH token will only
                                    // be generated when the responseType is "code"
        }
    }
};

console.log(aws_config["Auth"]["oauth"]);


export default aws_config;
