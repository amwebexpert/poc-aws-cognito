import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import Button from "react-bootstrap/Button";
import { UserInfo } from "./UserInfo";

const components = {
  Header() {
    return (
      <div>
        <img alt="Custom login" src="icon.png" height="100" />
      </div>
    );
  },
};

const formFields = {
  signIn: {
    username: {
      label: "Nom d'utilisateur",
      placeholder: "Inscrire nom d'utilisateur",
    },
  },
  resetPassword: {
    username: {
      placeholder: "Enter your email:",
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      placeholder: "Enter your Confirmation Code:",
      label: "New Label",
      isRequired: false,
    },
    confirm_password: {
      placeholder: "Enter your Password Please:",
    },
  },
  setupTOTP: {
    QR: {
      totpIssuer: "test issuer",
      totpUsername: "amplify_qr_test_user",
    },
    confirmation_code: {
      label: "New Label",
      placeholder: "Enter your Confirmation Code:",
      isRequired: false,
    },
  },
  confirmSignIn: {
    confirmation_code: {
      label: "New Label",
      placeholder: "Enter your Confirmation Code:",
      isRequired: false,
    },
  },
};

const LoginForm = () => {
  return (
    <Authenticator
      hideSignUp={true}
      formFields={formFields}
      components={components}
    >
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
