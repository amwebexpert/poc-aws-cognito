import { Amplify, Auth, API } from "aws-amplify";
import amplifyConfig from "./aws-exports";
import jwt_decode from "jwt-decode";

//  https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#top-level-configuration
Amplify.configure(amplifyConfig);

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

export const getAccessTokenExpirationDate = (token = "") => {
  if (!token) {
    return "-";
  }

  const decodedTokenInfo = jwt_decode(token);
  return new Date(decodedTokenInfo.exp * 1000).toString();
};

export const getAccessTokenCreationDate = (token = "") => {
  if (!token) {
    return "-";
  }

  const decodedTokenInfo = jwt_decode(token);
  return new Date(decodedTokenInfo.iat * 1000).toString();
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
