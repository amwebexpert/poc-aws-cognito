# poc-aws-cognito

POC with React app connecting to AWS Cognito through amplify-js library

## Note How to run in HTTPS mode

- Create a Self Signed certificate
``` bash
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
openssl rsa -in keytmp.pem -out key.pem

```

- In your package.json, modify start command
``` json
"scripts": {
    "start": "export HTTPS=true&&SSL_CRT_FILE=cert.pem&&SSL_KEY_FILE=key.pem react-scripts start"
  },
```

References:
- https://flaviocopes.com/react-how-to-configure-https-localhost/


## AWS Cognito concole

Hosted UI Endpoint:
- https://pocamwebexpertauth-dev.auth.us-east-1.amazoncognito.com/

Test Your Hosted UI Endpoint:
- https://pocamwebexpertauth-dev.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=hne2k6eoe1ignb4e6ge04iav1&redirect_uri=http://localhost:3000/


### OAuth 2.0 grant types: "code" vs "token"

- Amazon Cognito / User pools / the-pool-name-here / App Integration TAB / App client: the-app-client-id-here


## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
