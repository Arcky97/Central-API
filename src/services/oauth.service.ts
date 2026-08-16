import { getOAuthClient } from "../clients/oauth/oauth-clients";
import { OAuthProvider } from "../clients/oauth/oauth.type";

export class OAuthService {
  static getAuthorizationUrl(
    provider: OAuthProvider,
    state?: string
  ) {
    const client = getOAuthClient(provider);

    return client.getAuthorizationUrl(state);
  }

  static async authenticate<TMetadata>(
    provider: OAuthProvider,
    code: string
  ) {
    const client = getOAuthClient<TMetadata>(provider);

    const tokens = await client.exchangeCode(code);
    const user = await client.getUser(tokens);

    return {
      user,
      tokens
    };
  }
}