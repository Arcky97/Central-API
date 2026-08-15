import { OAuthClient, OAuthProvider } from "./oauth.type";
import { YoutubeOAuthClient } from "./YoutubeOAuthClient";

const clients: Record<OAuthProvider, OAuthClient> = {
  youtube: new YoutubeOAuthClient()
};

export function getOAuthClient(provider: OAuthProvider): OAuthClient {
  return clients[provider];
}