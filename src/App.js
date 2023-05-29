import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

import { Auth } from "aws-amplify";
import {
  getAccessTokenDates,
  getLocations,
  getTokenRefreshTimeout,
  getTokensFromSession,
  loadAuthSessionInfo,
  refreshAuthSession,
} from "./cognitoUtils";

// https://docs.amplify.aws/lib/auth/social/q/platform/js/#full-sample
const App = () => {
  const [user, setUser] = useState();
  const [tokens, setTokens] = useState();

  // computed props
  const isSignedIn = !!user;
  const { creationDate, expirationDate } = getAccessTokenDates(tokens?.token);
  const displayToken = tokens?.token
    ? `${tokens.token.slice(0, 10)}...${tokens.token.slice(-40)}`
    : "";

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
    setTokens(getTokensFromSession(session));
  };

  useEffect(() => {
    if (!tokens?.token) {
      return;
    }

    const timeoutDuration = getTokenRefreshTimeout(tokens.token);
    console.log(
      `Will refresh token after ${Math.floor(timeoutDuration / 1000)} sec`
    );
    const timeoutID = setTimeout(() => {
      refreshAuthSession().then((session) =>
        setTokens(getTokensFromSession(session))
      );
    }, timeoutDuration);

    return () => clearTimeout(timeoutID);
  }, [tokens?.token]);

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
        <li>
          Token: <pre>{displayToken}</pre>
        </li>
        <li>
          Creation: <pre>{creationDate}</pre>
        </li>
        <li>
          Expiration: <pre>{expirationDate}</pre>
        </li>
      </ul>

      <textarea
        wrap="off"
        style={{ width: "100%", marginTop: "1rem" }}
        rows={15}
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
