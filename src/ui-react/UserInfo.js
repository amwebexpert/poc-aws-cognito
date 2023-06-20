import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

export const UserInfo = () => {
  const { user } = useAuthenticator((context) => [context.user]);

  return (
    <div>
      <h4 style={{ textAlign: "center" }}>UserInfo component inside Authenticator wrapper component</h4>
      <div style={{ textAlign: "center" }}>{user.username}</div>
    </div>
  );
};
