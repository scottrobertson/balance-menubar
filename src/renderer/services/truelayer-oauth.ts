import * as request from "request-promise";
import { getTruelayerSecret } from "./secure-storage";
import { fetchMe } from "./truelayer";

const redirectUrl = "balancebar://oauth";

import { TrueLayerAccessToken, TrueLayerCredentials } from "./interfaces";

async function exchangeCodeForToken(truelayerClientId: string, code: string) {
  const requestOptions = {
    uri: `https://auth.truelayer.com/connect/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "authorization_code",
      client_id: truelayerClientId,
      client_secret: await getTruelayerSecret(),
      redirect_uri: redirectUrl,
      code: code,
    },
  };

  const response = await request.post(requestOptions);
  const parsedResponse = JSON.parse(response);
  return {
    access_token: parsedResponse.access_token,
    refresh_token: parsedResponse.refresh_token,
  };
}

export async function refreshAccessToken(truelayerClientId: string, refreshToken: string): Promise<TrueLayerAccessToken> {
  const requestOptions = {
    uri: `https://auth.truelayer.com/connect/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "refresh_token",
      client_id: truelayerClientId,
      client_secret: await getTruelayerSecret(),
      redirect_uri: redirectUrl,
      refresh_token: refreshToken,
    },
  };

  const response = await request.post(requestOptions);
  const parsedResponse = JSON.parse(response);
  return {
    access_token: parsedResponse.access_token,
    refresh_token: parsedResponse.refresh_token,
  };
}

export async function credentialsFromUrl(truelayerClientId: string, url: string): Promise<TrueLayerCredentials | undefined> {
  const fullUrl = new URL(url);
  const urlParams = new URLSearchParams(fullUrl.search);
  const code = urlParams.get("code");

  if (code) {
    let tokens;
    let me;

    try {
      console.log(`exchanging tokens using code ${code} and clientId: ${truelayerClientId}`);
      tokens = await exchangeCodeForToken(truelayerClientId, code);
    } catch (e) {
      console.error("tokens failure");
      console.error(e.error);
    }

    if (tokens) {
      try {
        console.log("getting /me");
        me = await fetchMe(tokens.access_token);
      } catch (e) {
        console.error("/me failure");
        console.error(e.error);
      }

      if (me?.credentials_id) {
        return {
          refreshToken: tokens.refresh_token,
          credentials: me,
        };
      }
    }
  } else {
    console.error("No code found in URL");
  }
}
