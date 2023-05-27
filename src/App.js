import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Amplify, Auth, API } from "aws-amplify";
import { PROJECT, OAUTH_DOMAIN, API_URL } from "./config/amplifyConfig";
import amplifyConfig from "./config/amplifyConfig";

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

async function currentUser() {
  try {
    console.info("currentUser------ ");

    const user = await Auth.currentAuthenticatedUser();
    console.info(user);
    alert(JSON.stringify(user, null, 2));
  } catch (error) {
    console.log("error signing in", error);
    alert("Not Signed In");
  }
}

async function getLocations() {
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
}

// https://docs.amplify.aws/lib/auth/social/q/platform/js/#full-sample
function FederatedForm() {
  return (
    <>
      <h1>Authentication POC for Stelar</h1>
      <h3>Project: {PROJECT}</h3>
      <h3>OAuth Domain: {OAUTH_DOMAIN}</h3>
      <h3>Api URL: {API_URL}api</h3>
      <Form className="pt-5">
        <Button className="pb-2" onClick={() => Auth.federatedSignIn()}>
          Sign In with Hosted UI
        </Button>
        <br></br>
        <br></br>
        <Button className="pb-2" onClick={() => currentUser()}>
          Current User
        </Button>
        <br></br>
        <br></br>
        <Button className="pb-2" onClick={() => getLocations()}>
          Get API Locations
        </Button>
        <br></br>
        <br></br>
        <Button className="pb-2" onClick={() => Auth.signOut()}>
          Sign Out
        </Button>
      </Form>
    </>
  );
}

function App() {
  return (
    <main className="container">
      <div className="mt-5">
        <FederatedForm />
      </div>
    </main>
  );
}

export default App;
