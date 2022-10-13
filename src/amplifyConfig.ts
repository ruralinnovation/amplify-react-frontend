export const aws_config = {
  "aws_project_region": "us-east-1",
  "Auth": {
    "identityPoolId": `${process.env.REACT_APP_IDENTITY_POOL_ID}`,
    "identityPoolRegion": `${process.env.REACT_APP_REGION}`,
    "region": `${process.env.REACT_APP_REGION}`,
    "userPoolId": `${process.env.REACT_APP_USER_POOL_ID}`,
    "userPoolWebClientId": `${process.env.REACT_APP_USER_POOL_CLIENT_ID}`,
    "oauth": {
      "domain": "https://authcori.auth.us-east-1.amazoncognito.com",
      "scope": [ "phone", "email", "profile", "openid", "aws.cognito.signin.user.admin" ],
      "redirectSignIn": "http://localhost:3000/",
      "redirectSignOut": "http://localhost:3000/",
      "responseType": "code", // or "token", note that REFRESH token will only be generated when the responseType is code
    }
  }
};

export default aws_config;
