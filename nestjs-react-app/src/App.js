import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import React from "react";

function App() {
  return (
    <GoogleOAuthProvider clientId="254045443266-ttkv2bu856q8g0psppcjkhieulu73hbe.apps.googleusercontent.com">
      <GoogleLogin
        buttonText="Login"
        onSuccess={(response) => {
          console.log(response);
          fetch("http://localhost:3000/auth/google-authentication", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: response.credential,
            }),
          })
            .then((response) => console.log(response))
            .then((data) => console.log(data));
        }}
      />
    </GoogleOAuthProvider>
  );
}

export default App;
