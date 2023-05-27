// You can find required variables in : https://<project>.stelar.ai/api/project-info
const AWS_REGION = "ca-central-1";
const USER_POOL_ID = "ca-central-1_0iernTCW6";
const USER_POOL_WEB_CLIENT_ID = "3csluqdedij22d2a6lho8d1sjh";

const PROJECT = "dev";

const OAUTH_DOMAIN = `auth.${PROJECT}.stelar.ai`;
const APP_URL = `https://127.0.0.1:3000`;
const API_URL = `https://${PROJECT}.stelar.ai/`;

export { PROJECT, OAUTH_DOMAIN, API_URL };

const configs = {
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: AWS_REGION,

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: USER_POOL_ID,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: USER_POOL_WEB_CLIENT_ID,

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    // mandatorySignIn: false,

    oauth: {
      domain: OAUTH_DOMAIN,
      scope: ["openid", "email"],
      redirectSignIn: APP_URL,
      redirectSignOut: APP_URL,
      responseType: "token",  // or 'token', note that REFRESH token will only be generated when the responseType is code
      // optional, for Cognito hosted ui specified options
      options: {
        // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
        AdvancedSecurityDataCollectionFlag: true,
      },
    },
  },

  API: {
    endpoints: [
      {
        name: "stelar",
        endpoint: API_URL,
      },
    ],
  },
};

export default configs;
