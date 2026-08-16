import { OAuthClient, OAuthProvider, YoutubeOAuthMetadata, DiscordOAuthMetadata, OAuthMetadataMap } from "./oauth.type";
import { YoutubeOAuthClient } from "./YoutubeOAuthClient";
//import { DiscordOAuthClient } from "./DiscordOAuthClient";

const clients: {
  [K in OAuthProvider]: OAuthClient<OAuthMetadataMap[K]>;
} = {
  youtube: new YoutubeOAuthClient(),
  //discord: new DiscordOAuthClient()
};

export function getOAuthClient(provider: "youtube"): OAuthClient<YoutubeOAuthMetadata>;
//export function getOAuthClient(provider: "discord"): OAuthClient<DiscordOAuthMetadata>;
export function getOAuthClient<TMetadata>(provider: OAuthProvider): OAuthClient<TMetadata>;
export function getOAuthClient<TMetadata>(provider: OAuthProvider): OAuthClient<TMetadata> {
  return clients[provider] as OAuthClient<TMetadata>;
}