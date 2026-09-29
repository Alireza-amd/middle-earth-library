import { serverEnv } from "@/data/env/server";
import { OAuthClient } from "../base";
import z from "zod";

export function craeteGoogleOAuth() {
  return new OAuthClient({
    provider: "google",
    urls: {
      authorize: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      user: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    scopeData: {
      seprator: " ",
      scopes: [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
    },
    userInfo: {
      schema: z.object({
        sub: z.string(),
        name: z.string(),
        email: z.email(),
      }),
      parser: (userData) => {
        return {
          id: userData.sub,
          name: userData.name,
          email: userData.email,
        };
      },
    },
    clientId: serverEnv.GOOGLE_CLIENT_ID,
    clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
  });
}
