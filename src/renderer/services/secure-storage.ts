"use strict";

import keytar from "keytar";
import { Credential } from "./interfaces";

const KEYCHAIN_NAMESPACE = "balance-menubar";

export async function storeRefreshToken(credentials: Credential, refreshToken: string): Promise<void> {
  return await keytar.setPassword(KEYCHAIN_NAMESPACE, `credentials_${credentials.credentials_id}_refresh_token`, refreshToken);
}

export async function getRefreshToken(credentials: Credential): Promise<string | null> {
  return await keytar.getPassword(KEYCHAIN_NAMESPACE, `credentials_${credentials.credentials_id}_refresh_token`);
}

export async function deleteRefreshToken(credentials: Credential): Promise<boolean> {
  return await keytar.deletePassword(KEYCHAIN_NAMESPACE, `credentials_${credentials.credentials_id}_refresh_token`);
}

export async function storeAccessToken(credentials: Credential, accessToken: string): Promise<void> {
  return await keytar.setPassword(KEYCHAIN_NAMESPACE, `credentials_${credentials.credentials_id}_access_token`, accessToken);
}

export async function getAccessToken(credentials: Credential): Promise<string | null> {
  return await keytar.getPassword(KEYCHAIN_NAMESPACE, `credentials_${credentials.credentials_id}_access_token`);
}

export async function deleteAccessToken(credentials: Credential): Promise<boolean> {
  return await keytar.deletePassword(KEYCHAIN_NAMESPACE, `credentials_${credentials.credentials_id}_access_token`);
}

export async function storeTruelayerSecret(secret: string): Promise<void> {
  return await keytar.setPassword(KEYCHAIN_NAMESPACE, "truelayer-client-secret", secret);
}

export async function deleteTruelayerSecret(): Promise<boolean> {
  return await keytar.deletePassword(KEYCHAIN_NAMESPACE, "truelayer-client-secret");
}

export async function getTruelayerSecret(): Promise<string | null> {
  return await keytar.getPassword(KEYCHAIN_NAMESPACE, "truelayer-client-secret");
}
