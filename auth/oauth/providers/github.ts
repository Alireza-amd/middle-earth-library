import { serverEnv } from "@/data/env/server";
import { OAuthClient } from "../base";
import z from "zod";

export function craeteGithubOAuth() {
  return new OAuthClient({
    provider: "github",
    urls: {
      authorize: "https://github.com/login/oauth/authorize",
      token: "https://github.com/login/oauth/access_token",
      user: "https://api.github.com/user",
    },
    scopeData: { seprator: ",", scopes: ["read:user", "user:email"] },
    userInfo: {
      schema: z.object({
        id: z.number(),
        login: z.string(),
        name: z.string().nullable(),
        email: z.email(),
      }),
      parser: (userData) => {
        return {
          id: userData.id,
          name: userData.name ?? userData.login,
          email: userData.email,
        };
      },
    },
    clientId: serverEnv.GITHUB_CLIENT_ID,
    clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
  });
}
