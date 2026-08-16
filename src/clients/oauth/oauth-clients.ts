import { OAuthClient, OAuthProvider, YoutubeOAuthMetadata, OAuthMetadataMap } from "./oauth.type";
import { YoutubeOAuthClient } from "./YoutubeOAuthClient";

const clients: {
  [K in OAuthProvider]: OAuthClient<OAuthMetadataMap[K]>;
} = {
  youtube: new YoutubeOAuthClient()
};

export function getOAuthClient(provider: "youtube"): OAuthClient<YoutubeOAuthMetadata>;
export function getOAuthClient<TMetadata>(provider: OAuthProvider): OAuthClient<TMetadata>;
export function getOAuthClient<TMetadata>(provider: OAuthProvider): OAuthClient<TMetadata> {
  return clients[provider] as OAuthClient<TMetadata>;
}