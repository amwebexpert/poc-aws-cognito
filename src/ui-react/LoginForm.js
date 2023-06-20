import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import Button from "react-bootstrap/Button";
import { UserInfo } from "./UserInfo";

const LoginForm = () => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <UserInfo />

          <Button className="pb-2 m-1" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      )}
    </Authenticator>
  );
};

export default LoginForm;
