import Vue from "vue";
import Vuex, { Commit, Dispatch } from "vuex";

import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";

import { sortBy } from "lodash";
import { storeRefreshToken, deleteTruelayerSecret, storeTruelayerSecret, deleteRefreshToken, deleteAccessToken } from "./services/secure-storage";
import { refreshAllAccounts } from "./services/accounts";
import { ReturnedAccount, Credential, TrueLayerClientPair, TrueLayerCredentials } from "./services/interfaces";

Vue.use(Vuex);

interface State {
  accounts?: ReturnedAccount[];
  lastRefreshedAt?: string;
  truelayerClientId?: string;
  credentials?: Credential[];
  oAuthConnecting: boolean;
}

const state = {
  accounts: undefined,
  lastRefreshedAt: undefined,
  truelayerClientId: undefined,
  credentials: undefined,
  oAuthConnecting: false,
} as State;

const mutations = {
  resetAccounts(state: State): void {
    state.accounts = undefined;
  },

  async resetCredentials(state: State): Promise<void> {
    if (state.credentials) {
      state.credentials.forEach((credential) => {
        deleteRefreshToken(credential);
        deleteAccessToken(credential);
      });
    }

    state.credentials = undefined;
  },

  setAccounts(state: State, accounts: ReturnedAccount[]): void {
    state.accounts = accounts;
  },

  setConnecting(state: State, connecting: boolean): void {
    state.oAuthConnecting = connecting;
  },

  async deleteCredential(state: State, credential: Credential): Promise<void> {
    if (state.credentials) {
      if (state.credentials.length === 1) {
        state.credentials = undefined;
      } else {
        const index = state.credentials.findIndex((c) => c.credentials_id === credential.credentials_id);
        state.credentials.splice(index, 1);
      }
    }

    await deleteRefreshToken(credential);
    await deleteAccessToken(credential);
  },

  async addCredentials(state: State, oauth: TrueLayerCredentials): Promise<void> {
    if (state.credentials === undefined) {
      state.credentials = [];
    }

    // Ensure credentials are never added twice
    const credentialExists = state.credentials.find((c) => c.credentials_id === oauth.credentials.credentials_id);
    if (!credentialExists) {
      state.credentials.push(oauth.credentials);
      await storeRefreshToken(oauth.credentials, oauth.refreshToken);
    }
  },

  setLastRefreshedAt(state: State, timestamp: string): void {
    state.lastRefreshedAt = timestamp;
  },

  async setTrueLayer(state: State, truelayer: TrueLayerClientPair): Promise<void> {
    state.truelayerClientId = truelayer.clientId;

    if (truelayer.clientSecret) {
      await storeTruelayerSecret(truelayer.clientSecret);
    } else {
      await deleteTruelayerSecret();
    }
  },
};

const actions = {
  resetAll({ commit }: { commit: Commit }): void {
    commit("resetCredentials");
    commit("resetAccounts");
    commit("setTrueLayer", {});
  },

  resetAccounts({ commit }: { commit: Commit }): void {
    commit("resetAccounts");
  },

  setTrueLayer({ commit }: { commit: Commit }, truelayer: TrueLayerClientPair): void {
    commit("setTrueLayer", truelayer);
  },

  setConnecting({ commit }: { commit: Commit }, connecting: boolean): void {
    commit("setConnecting", connecting);
  },

  addCredential({ commit, dispatch }: { commit: Commit; dispatch: Dispatch }, credential: Credential): void {
    commit("addCredentials", credential);
    dispatch("refreshAccounts");
  },

  deleteCredential({ commit }: { commit: Commit }, credential: Credential): void {
    commit("deleteCredential", credential);
  },

  async refreshAccounts({ state, commit }: { state: State; commit: Commit }): Promise<void> {
    commit("resetAccounts");
    commit("setLastRefreshedAt", undefined);

    if (state.truelayerClientId && state.credentials) {
      commit("setAccounts", await refreshAllAccounts(state.truelayerClientId, state.credentials));
      commit("setLastRefreshedAt", new Date());
    }
  },
};

const getters = {
  allAccounts(state: State): ReturnedAccount[] | undefined {
    if (state.accounts) {
      return sortBy(state.accounts, ["bank.name", "name"]);
    }
  },
  allCredentials(state: State): Credential[] | undefined {
    return state.credentials;
  },
  lastRefreshedAt(state: State): string | undefined {
    return state.lastRefreshedAt;
  },
  hasTruelayerClient(state: State): boolean {
    return state.truelayerClientId !== undefined;
  },
  truelayerClientId(state: State): string | undefined {
    return state.truelayerClientId;
  },
  isConnecting(state: State): boolean {
    return state.oAuthConnecting;
  },
};

const ls = new SecureLS({ isCompression: false, encodingType: "aes" });

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [
    createPersistedState({
      key: "balancebar",
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
  strict: process.env.NODE_ENV !== "production",
});
