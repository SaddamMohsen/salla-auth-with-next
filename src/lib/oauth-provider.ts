// import  OAuthConfig  from 'next-auth';
import { OAuthConfig } from 'next-auth/providers/oauth';

export type OAuthProviderOptions = Pick<OAuthConfig<any>, 'clientId' | 'clientSecret'>;
// export type OAuthUserConfig<P>=
// Omit<Partial<OAuthConfig<P>>, "options" | "type"> & Required<Pick<OAuthConfig<P>, "clientId" | "clientSecret">>