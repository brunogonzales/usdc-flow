<template>
  <div class="container">
    <h2>USDC</h2>
    <section>
      <p>
        What is USDC? USDC (USD Coin) is the world’s leading digital US dollar
        stablecoin, fully collateralized 1-for-1 with USD. This means that for
        every 1 USDC token in circulation there is USD $1 held in collateral.
      </p>
    </section>
    <section>
      <p>Create a new wallet clicking the button below.</p>
      <pre><code>{{wallet}}</code></pre>
      <button :aria-busy="creatingWallet" @click="createWallet">
        Create a Circle wallet
      </button>
    </section>

    <section>
      <p>Then create a deposit address to receive funds.</p>
      <pre><code>{{depositAddress}}</code></pre>
      <button
        v-if="!depositAddress"
        :aria-busy="creatingDepositAddress"
        @click="createDepositAddress"
      >
        Create a Deposit Address
      </button>
    </section>

    <section>
      <p>
        You can now fund your account with USDC going to the
        <a href="https://usdcfaucet.com/"> USDC faucet</a>. Remember to use the
        deposit address you just created.
      </p>

      <pre><code>{{fundStatus}}</code></pre>
      <button :aria-busy="checkingFundStatus" @click="checkFundStatus">
        Check fund status
      </button>
    </section>

    <section>
      Now try moving the USDC we got from the faucet to a
      <a
        class="kbd"
        href="https://flow-view-source.com/testnet/account/0xaaa0a0ac16e7cd6c"
        >Flow address on testnet.</a
      >
      <input disabled v-model="flowAddress" placeholder="Destination address" />
      <button
        v-if="!transfer"
        :aria-busy="creatingTransfer"
        @click="createTransfer"
      >
        Create transfer
      </button>
      <pre v-else><code>{{ transfer }}</code></pre>
    </section>

    <section>
      <p>
        After creating a transfer we can check it's status at any given moment:
      </p>
      <button @click="checkTransferStatus">Check transfer status</button>
      <pre><code>{{transferStatus}}</code></pre>
    </section>

    <section>
      <h3>Links</h3>
      <p>
        See the
        <a href="https://github.com/brunogonzales/usdc-flow"
          >source code at GitHub</a
        >.
      </p>
    </section>
  </div>
</template>

<script>
// If you are planning on using this for production store this secret somewhere safe.
const CIRCLE_SECRET =
  "QVBJX0tFWTowMjI2YjJlODExMDlhNGQwMjE5ZGRhNjRjNTY3MDRhODozZjJlNDVjYzIzZTc0MTA2NjU1NzRkZjg2YTkxYTVkNw==";
export default {
  data() {
    return {
      currentUser: null,
      creatingWallet: false,
      wallet: null,
      creatingDepositAddress: false,
      depositAddress: null,
      checkingFundStatus: false,
      fundStatus: [],
      creatingTransfer: false,
      flowAddress: "0xaaa0a0ac16e7cd6c",
      transfer: null,
      transferStatus: null,
    };
  },

  mounted() {
    this.$fcl.currentUser.subscribe((user) => (this.currentUser = user));
    this.$axios.setHeader("Authorization", `Bearer ${CIRCLE_SECRET}`);
    this.$axios.setHeader("Content-Type", "application/json");
  },

  methods: {
    async createDepositAddress() {
      this.creatingDepositAddress = true;
      const url =
        "https://api-sandbox.circle.com/v1/wallets/" +
        this.wallet.walletId +
        "/addresses";
      try {
        const response = await this.$axios.post(url, {
          idempotencyKey: this.$uuid(),
          currency: "USD",
          chain: "FLOW",
        });
        this.depositAddress = response.data.data;
      } catch (e) {
        console.log(e.message);
      }
      this.creatingDepositAddress = false;
    },

    async createWallet() {
      this.creatingWallet = true;
      try {
        const response = await this.$axios.post(
          "https://api-sandbox.circle.com/v1/wallets",
          {
            idempotencyKey: this.$uuid(),
          }
        );
        this.wallet = response.data.data;
      } catch (e) {
        console.log(e.message);
      }
      this.creatingWallet = false;
    },

    async checkFundStatus() {
      this.checkingFundStatus = true;
      try {
        const url =
          "https://api-sandbox.circle.com/v1/transfers?destinationWalletId=" +
          this.wallet.walletId;
        const response = (await this.$axios.get(url)).data.data;
        this.fundStatus = response;
      } catch (e) {
        console.log(e.message);
      }
      this.checkingFundStatus = false;
    },

    async createTransfer() {
      this.creatingTransfer = true;
      const destinationAddress = this.flowAddress;
      const idempotencyKey = this.$uuid();
      try {
        const params = {
          idempotencyKey,
          source: {
            type: "wallet",
            id: this.wallet.walletId,
          },
          destination: {
            type: "blockchain",
            address: destinationAddress,
            chain: "FLOW",
          },
          amount: {
            amount: "1.00",
            currency: "USD",
          },
        };
        console.log(params);
        const url = "https://api-sandbox.circle.com/v1/transfers";
        const response = (await this.$axios.post(url, params)).data;
        this.transfer = response.data;
      } catch (e) {
        console.log(e.message);
      }
      this.creatingTransfer = false;
    },

    async checkTransferStatus() {
      const url =
        "https://api-sandbox.circle.com/v1/transfers/" + this.transfer.id;
      const response = (await this.$axios.get(url)).data;
      this.transferStatus = response.data;
    },
  },
};
</script>