const awsconfig = {
    "aws_project_region": "us-east-1",
    "Auth": {
        "identityPoolId": `${import.meta.env.VITE_IDENTITY_POOL_ID}`,
        "identityPoolRegion": `${import.meta.env.VITE_REGION}`,
        "region": `${import.meta.env.VITE_REGION}`,
        "userPoolId": `${import.meta.env.VITE_USER_POOL_ID}`,
        "userPoolWebClientId": `${import.meta.env.VITE_USER_POOL_CLIENT_ID}`
    }
};


export default awsconfig;
