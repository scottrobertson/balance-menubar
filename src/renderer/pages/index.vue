<template>
  <div class="dark:bg-black">
    <div class="">
      <div class="bg-white px-4 py-3 border-b border-gray-200 dark:bg-black dark:border-gray-800 pb-5">
        <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap">
          <div class="ml-4 mt-2">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white pt-2">Balances</h3>

            <div v-if="lastRefreshed && accounts">
              <span class="text-gray-400 text-xs">Last updated {{ lastRefreshed }} - <a class="underline cursor-pointer" @click="refreshAccounts">Refresh</a></span>
            </div>

            <div v-else>
              <span class="text-gray-400 text-xs">Updating...</span>
            </div>
          </div>
          <div class="ml-4 mt-2 flex-shrink-0 pt-2">
            <button
              type="button"
              class="relative inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="startTrueLayerAuth"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="">
      <div v-if="credentials">
        <div v-if="accounts && accounts.length > 0">
          <ul class="divide-y divide-gray-200 dark:divide-gray-800">
            <Account v-for="account in accounts" :key="account.id" :account="account" />
          </ul>
        </div>

        <div v-else-if="accounts && accounts.length == 0" class="p-5">
          No accounts found for the credentials given. This generally means access has been denied.

          <div class="mt-5">
            <div v-for="credential in credentials" :key="credential.credentials_id">- {{ credential.provider.display_name }}</div>
          </div>
        </div>

        <div v-else-if="accounts === undefined" class="p-5 dark:text-gray-400 text-center">
          <div class="spinner">
            <div class="double-bounce1" />
            <div class="double-bounce2" />
          </div>
        </div>
      </div>

      <div v-else class="p-5 dark:text-white">No credentials here. Add one!</div>
    </div>
  </div>
</template>

<script>
import { credentialsFromUrl } from "../services/truelayer-oauth";

import Account from "../components/account";

export default {
  name: "LandingPage",

  components: {
    Account,
  },

  data() {
    return {
      lastRefreshed: undefined,
    };
  },

  computed: {
    hasTruelayerClient() {
      return this.$store.getters.hasTruelayerClient;
    },
    credentials() {
      return this.$store.getters.allCredentials;
    },
    accounts() {
      return this.$store.getters.allAccounts;
    },
    lastRefreshedAt() {
      return this.$store.getters.lastRefreshedAt;
    },
  },

  watch: {
    lastRefreshedAt(newValue, oldValue) {
      this.updateLocalRefreshedAt(newValue);
    },
  },

  mounted() {
    if (this.hasTruelayerClient) {
      if (this.accounts === undefined) {
        this.refreshAccounts();
      }

      // Refresh accounts every hour
      setInterval(() => {
        this.refreshAccounts();
      }, 60000 * 60);

      // Keep the "last updated at" reactive.
      this.updateLocalRefreshedAt(this.lastRefreshedAt);
      setInterval(() => {
        this.updateLocalRefreshedAt(this.lastRefreshedAt);
      }, 5000);

      this.$electron.ipcRenderer.on("refresh", () => {
        this.refreshAccounts();
      });

      this.$electron.ipcRenderer.on("reset", () => {
        this.resetAll();
      });

      this.$electron.ipcRenderer.on("handle-oauth", (event, url) => {
        this.addCredentialsFromUrl(url);
      });

      this.$electron.ipcRenderer.on("goto-connections", (event) => {
        this.$router.push("/connections");
      });
    } else {
      this.$router.push("/truelayer");
    }
  },

  methods: {
    async addCredentialsFromUrl(url) {
      this.$store.dispatch("resetAccounts");

      const credentials = await credentialsFromUrl(this.$store.getters.truelayerClientId, url);

      if (credentials) {
        this.$store.dispatch("addCredential", credentials);
      }
    },
    updateLocalRefreshedAt(value) {
      this.lastRefreshed = this.$moment(value).fromNow();
    },
    refreshAccounts() {
      this.$store.dispatch("refreshAccounts");
    },
    resetAll() {
      this.$store.dispatch("resetAll");
      this.$router.push("/truelayer");
    },
    startTrueLayerAuth() {
      this.$electron.ipcRenderer.sendSync("oauth-start", this.$store.getters.truelayerClientId);
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.spinner {
  width: 40px;
  height: 40px;

  position: relative;
  margin: 100px auto;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #333;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>