<template>
  <div class="dark:bg-black bg-white select-none">
    <div class="bg-white px-4 py-3 border-b border-gray-200 dark:bg-black dark:border-gray-800">
      <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Setup TrueLayer</h3>
    </div>

    <div class="pl-5 pr-5 bg-white dark:bg-black dark:text-white">
      <p class="">Head over to TrueLayer and create an application. We need your Client ID/Secret.</p>

      <p class="mt-5">
        <a class="cursor-pointer underline" @click="openLink('https://console.truelayer.com')">https://console.truelayer.com</a>
      </p>

      <p class="mt-5">The redirect url should be: balancebar://oauth</p>

      <form @submit="saveCredentials">
        <div class="mt-5">
          <label for="client_id" class="block text-sm font-medium text-gray-700 dark:text-white">TrueLayer Client ID</label>
          <div class="mt-1">
            <input
              id="client_id"
              v-model="clientId"
              type="text"
              name="client_id"
              class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-black"
              placeholder="TrueLayer Client ID"
            />
          </div>
        </div>

        <div class="mt-5">
          <label for="client_secret" class="block text-sm font-medium text-gray-700 dark:text-white">TrueLayer Client Secret</label>
          <div class="mt-1">
            <input
              id="client_secret"
              v-model="clientSecret"
              type="password"
              name="client_secret"
              class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-black"
              placeholder="TrueLayer Client Secret"
            />
          </div>
        </div>

        <div class="mt-5">
          <button
            type="button"
            class="w-full text-center py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="saveCredentials"
          >
            Save Credentials
          </button>
        </div>
      </form>
    </div>

    <div class="text-xs text-gray-400 dark:text-gray-400 p-5">Your secret will be encrypted in your system's keychain.</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      clientId: undefined,
      clientSecret: undefined,
    };
  },

  computed: {
    hasTruelayerCredentials(): boolean {
      return this.$store.getters.hasTruelayerCredentials;
    },
  },

  mounted(): void {
    if (this.hasTruelayerCredentials) {
      this.$router.push("/");
    }
  },

  methods: {
    openLink(link: string): void {
      this.$electron.shell.openExternal(link);
    },
    saveCredentials(): void {
      this.$store.dispatch("setTrueLayer", {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      });
      this.$router.push("/");
    },
  },
});
</script>
