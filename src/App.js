import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

import { Auth } from "aws-amplify";
import {
  getAccessTokenCreationDate,
  getAccessTokenExpirationDate,
  getLocations,
  getTokensFromSession,
  loadAuthSessionInfo,
  refreshAuthSession,
} from "./cognitoUtils";

// https://docs.amplify.aws/lib/auth/social/q/platform/js/#full-sample
const App = () => {
  const [user, setUser] = useState();
  const [tokens, setTokens] = useState();
  const isSignedIn = !!user;
  const token = tokens?.token ?? "";
  const displayToken = token ? `${token.slice(0, 10)}...${token.slice(-40)}` : "";

  useEffect(() => {
    const loadInfo = async () => {
      const { user, tokens } = await loadAuthSessionInfo();
      setTokens(tokens);
      setUser(user);
    };

    loadInfo();
  }, [tokens]);

  const handleRefreshSession = async () => {
    const session = await refreshAuthSession();
    const tokens = getTokensFromSession(session);
    setTokens(tokens);
  };

  return (
    <main className="container">
      <h2>AWS Cognito Authentication POC</h2>

      {!isSignedIn && (
        <Button className="pb-2 m-1" onClick={() => Auth.federatedSignIn()}>
          Sign In with Hosted UI
        </Button>
      )}

      {isSignedIn && (
        <Button className="pb-2 m-1" onClick={() => Auth.signOut()}>
          Sign Out
        </Button>
      )}

      <Button
        className="pb-2 m-1"
        onClick={handleRefreshSession}
        disabled={!isSignedIn}
      >
        Refresh token
      </Button>

      <Button className="pb-2 m-1" onClick={getLocations} disabled={true}>
        Get API Locations
      </Button>

      <ul style={{ width: "100%", marginTop: "1rem" }}>
        <li>Token: <strong>{displayToken}</strong></li>
        <li>Creation: <strong>{getAccessTokenCreationDate(tokens?.token)}</strong></li>
        <li>Expiration: <strong>{getAccessTokenExpirationDate(tokens?.token)}</strong></li>
      </ul>

      <textarea
        wrap="off"
        style={{ width: "100%", marginTop: "1rem" }}
        rows={20}
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
