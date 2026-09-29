import crypto from "crypto";
import { TProviders } from "@/drizzle/schema";
import z from "zod";
import { craeteGithubOAuth } from "./providers/github";
import { craeteGoogleOAuth } from "./providers/google";
import { generateRandomBytes } from "../passwordHasher";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const COOKIES_EXPIRATION_IN_SECONDS =  60;
const STATE_KEY_COOKIES = "oAuthState";
const CODE_VERIFIER_KEY_COOKIES = "oAuthCodeVerfier";

export class OAuthClient<T> {
  private provider: TProviders;
  private clientId: string;
  private clientSecret: string;
  private userInfo: {
    schema: z.ZodSchema<T>;
    parser: (data: T) => {
      id: string | number;
      name: string;
      email: string;
    };
  };
  private scopeData: {
    seprator: string;
    scopes: string[];
  };
  private urls: {
    authorize: string;
    token: string;
    user: string;
  };

  private tokenSceham = z.object({
    access_token: z.string(),
    token_type: z.string(),
  });
  constructor({
    provider,
    urls,
    scopeData,
    clientId,
    clientSecret,
    userInfo,
  }: {
    urls: {
      authorize: string;
      token: string;
      user: string;
    };
    scopeData: {
      seprator: string;
      scopes: string[];
    };
    userInfo: {
      schema: z.ZodSchema<T>;
      parser: (data: T) => {
        id: string | number;
        name: string;
        email: string;
      };
    };
    clientId: string;
    clientSecret: string;
    provider: TProviders;
  }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.urls = urls;
    this.scopeData = scopeData;
    this.provider = provider;
    this.userInfo = userInfo;
  }

  private createRedirectURL() {
    return `http://localhost:3000/api/oauth/${this.provider}`;
  }
  async createAuthorizationURL(cookies: Pick<ReadonlyRequestCookies, "set">) {
    const url = new URL(this.urls.authorize);
    const codeVerifier = generateCodeVerifier(cookies);
    const state = generateState(cookies);
    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("state", state);
    url.searchParams.set(
      "code_challenge",
      crypto.hash("sha256", codeVerifier, "base64url")
    );
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("redirect_uri", this.createRedirectURL());
    url.searchParams.set(
      "scope",
      this.scopeData.scopes.join(this.scopeData.seprator)
    );
    return url.toString();
  }

  async fetchUser(
    code: string,
    state: string,
    cookies: Pick<ReadonlyRequestCookies, "get">
  ) {
    if (!compareStates(state, cookies))
      throw new Error("States doen't matched.");

    const codeVerifier = getCodeVerifierFromCookies(cookies);
    const { access_token, token_type } = await this.fetchToken(
      code,
      codeVerifier
    );

    const user = await fetch(this.urls.user, {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((userData) => {
        const { success, data, error } =
          this.userInfo.schema.safeParse(userData);
        if (!success) throw new InvalidUserInfo(error);
        return this.userInfo.parser(data);
      });

    return user;
  }
  private async fetchToken(code: string, codeVerifier: string) {
    return fetch(this.urls.token, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: this.createRedirectURL(),
        code_verifier: codeVerifier,
      }),
    })
      .then((res) => res.json())
      .then((tokenData) => {
        const { success, data, error } = this.tokenSceham.safeParse(tokenData);
        if (!success) throw new InvalidTokenInfo(error);
        return data;
      });
  }
}

class InvalidUserInfo extends Error {
  constructor(error: z.ZodError) {
    super("Invalid user info.");
    this.cause = error;
  }
}
class InvalidTokenInfo extends Error {
  constructor(error: z.ZodError) {
    super("Invalid Token info.");
    this.cause = error;
  }
}

export function createOAuthClient(provider: TProviders) {
  switch (provider) {
    case "github":
      return craeteGithubOAuth();
      break;
    case "google":
      return craeteGoogleOAuth();
    default:
      throw new Error(
        `There is no provider with this name ${provider satisfies never}`
      );
      break;
  }
}

function compareStates(
  state: string,
  cookies: Pick<ReadonlyRequestCookies, "get">
) {
  const stateFromCookies = cookies.get(STATE_KEY_COOKIES)?.value;

  return state == stateFromCookies;
}
function getCodeVerifierFromCookies(
  cookies: Pick<ReadonlyRequestCookies, "get">
) {
  const codeVerifier = cookies.get(CODE_VERIFIER_KEY_COOKIES)?.value;

  if (codeVerifier == null)
    throw new Error("CodeVerifier missing from cookies.");

  return codeVerifier;
}

function generateState(cookies: Pick<ReadonlyRequestCookies, "set">) {
  const state = generateRandomBytes(64);
  cookies.set(STATE_KEY_COOKIES, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    expires: Date.now() + COOKIES_EXPIRATION_IN_SECONDS * 1000,
  });
  return state;
}
function generateCodeVerifier(cookies: Pick<ReadonlyRequestCookies, "set">) {
  const codeVerifier = generateRandomBytes(64);
  cookies.set(CODE_VERIFIER_KEY_COOKIES, codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    expires: Date.now() + COOKIES_EXPIRATION_IN_SECONDS * 1000,
  });
  return codeVerifier;
}
