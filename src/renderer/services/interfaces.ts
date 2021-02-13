export interface ReturnedBank {
  name: string;
  icon: string;
  logo: string;
}

export interface ReturnedAccount {
  bank: ReturnedBank;
  name: string;
  balance?: string;
  error?: string;
}

export interface Credential {
  credentials_id: string;
  scopes: string[];
  provider: TrueLayerProvider;
}

export interface TrueLayerCardOrAccount {
  account_id: string;
  display_name: string;
}

export interface TrueLayerAccessToken {
  access_token: string;
  refresh_token: string;
}

export interface TrueLayerClientPair {
  clientId: string;
  clientSecret: string;
}

export interface TrueLayerCredentials {
  refreshToken: string;
  credentials: Credential;
}

export interface TrueLayerBalance {
  currency: string;
  available: number;
  current: number;
  overdraft: number;
}

export interface TrueLayerProvider {
  display_name: string;
  logo_uri: string;
  provider_id: string;
}

export interface TrueLayerMe {
  credentials_id: string;
  provider: TrueLayerProvider;
  scopes: string[];
}

export interface TrueLayerDebug {
  credentials_id: string;
  debug_id: string;
  provider_id: string;
}
