import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

import { Auth } from "aws-amplify";
import { getLocations, loadAuthSessionInfo } from "./cognitoUtils";

// https://docs.amplify.aws/lib/auth/social/q/platform/js/#full-sample
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
      <h2>AWS Cognito Authentication POC</h2>

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
