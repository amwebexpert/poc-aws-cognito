import { Amplify, Auth, API } from "aws-amplify";
import amplifyConfig from "./aws-exports";
import jwt_decode from "jwt-decode";

//  https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#top-level-configuration
Amplify.configure(amplifyConfig);

const REFRESH_TOKEN_DELTA_IN_SECONDS = 60; // seconds

export const getUserSession = async () => {
  const cognitoUser = await Auth.currentAuthenticatedUser();
  return new Promise((resolve, reject) => {
    cognitoUser.getSession((error, session) => {
      return error ? reject(error) : resolve(session);
    });
  });
};

export const loadAuthSessionInfo = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const session = await Auth.currentSession();

    const token = session.getAccessToken().getJwtToken();
    const idToken = session.getIdToken().getJwtToken();
    const refreshToken = session.getRefreshToken().getToken();

    const tokens = { token, idToken, refreshToken };
    return { user, tokens };
  } catch (_error) {
    console.log("user not authenticated");
  }

  return {};
};

export const refreshAuthSession = async () => {
  const cognitoUser = await Auth.currentAuthenticatedUser();
  const session = await getUserSession();
  const refreshToken = session.getRefreshToken();
  console.log("Refreshing auth session", { session, refreshToken });

  return new Promise((resolve, reject) => {
    cognitoUser.refreshSession(refreshToken, (error, session) => {
      return error ? reject(error) : resolve(session);
    });
  });
};

export const getTokensFromSession = async (session) => {
  const token = session.getAccessToken().getJwtToken();
  const idToken = session.getIdToken().getJwtToken();
  const refreshToken = session.getRefreshToken().getToken();

  return { token, idToken, refreshToken };
};

export const getTokenRefreshTimeout = (token = "") => {
  const decodedTokenInfo = jwt_decode(token);
  const refreshSessionAt = new Date(
    (decodedTokenInfo.exp - REFRESH_TOKEN_DELTA_IN_SECONDS) * 1000
  );

  let timeoutDuration = refreshSessionAt.getTime() - Date.now();
  if (timeoutDuration < 0) {
    timeoutDuration = 0;
  }

  return timeoutDuration;
};

export const getAccessTokenDates = (token = "") => {
  if (!token) {
    return { creationDate: "-", expirationDate: "-" };
  }

  const { exp, iat } = jwt_decode(token);
  return {
    creationDate: new Date(iat * 1000).toString(),
    expirationDate: new Date(exp * 1000).toString(),
  };
};

export const getLocations = async () => {
  const session = await Auth.currentSession();
  const { token, idToken, refreshToken } = getTokensFromSession(session);
  console.log("current tokens", { token, idToken, refreshToken });

  const authorizationHeader = { Authorization: `Bearer ${idToken}` };
  const locations = await API.get(
    "stelar",
    "/api/locations?include=organization,assetsCount&sort=-updated_at&page[number]=1&page[size]=10",
    {
      headers: authorizationHeader,
    }
  );
  console.info(locations);
  alert(JSON.stringify(locations, null, 2));
};
