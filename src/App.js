import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

import { Amplify, Auth, API } from "aws-amplify";
import amplifyConfig from "./aws-exports";

//  https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#top-level-configuration
Amplify.configure(amplifyConfig);

const getUserSession = async () => {
  const cognitoUser = await Auth.currentAuthenticatedUser();
  return new Promise((resolve, reject) => {
    cognitoUser.getSession((error, session) => {
      return error ? reject(error) : resolve(session);
    });
  });
};

const loadAuthSessionInfo = async () => {
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

const refreshAuthSession = async () => {
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

const getLocations = async () => {
  const session = await Auth.currentSession();
  const token = session.getAccessToken().getJwtToken();
  const idToken = session.getIdToken().getJwtToken();
  const refreshToken = session.getRefreshToken().getToken();
  console.log("current session", session);
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

// https://docs.amplify.aws/lib/auth/social/q/platform/js/#full-sample
export const CognitoExample = () => {};

const App = () => {
  const [user, setUser] = useState();
  const [tokens, setTokens] = useState();

  useEffect(() => {
    const loadInfo = async () => {
      const { user, tokens } = await loadAuthSessionInfo();
      setTokens(tokens);
      setUser(user);
    };

    loadInfo();
  }, []);

  return (
    <main className="container">
      <h2>Authentication POC</h2>

      <Button className="pb-2" onClick={() => Auth.federatedSignIn()}>
        Sign In with Hosted UI
      </Button>

      <Button className="pb-2" onClick={() => Auth.signOut()}>
        Sign Out
      </Button>

      <Button className="pb-2" onClick={() => getLocations()} disabled={true}>
        Get API Locations
      </Button>

      <textarea
        wrap="off"
        style={{ width: "100%", marginTop: "1rem" }}
        rows={10}
        value={JSON.stringify(user, null, 4)}
        readOnly={true}
      />

      <textarea
        wrap="off"
        style={{ width: "100%", marginTop: "1rem" }}
        rows={5}
        value={JSON.stringify(tokens, null, 4)}
        readOnly={true}
      />
    </main>
  );
};

export default App;
