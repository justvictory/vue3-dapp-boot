<script setup lang="ts">
import Header from './components/Header.vue'
import Dropdown from './components/Dropdown.vue'
import {
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
  ChainId,
  useEthersHooks,
  MetaMaskConnector,
  WalletConnectConnector,
  CoinbaseWalletConnector,
  ConnectionStatus
} from 'vue3-dapp-boot'
import {onBeforeMount, ref, watch} from 'vue'

const isDev = window.location.host === 'localhost:3000'
const infuraId = isDev
  ? '2485de6bf0744ad4bdd1f3f9d26225eb'
  : '2485de6bf0744ad4bdd1f3f9d26225eb'

const { openBoard } = useBoard()
const {
  wallet,
  connectWithWallet,
  disconnectWallet,
  onDisconnectWallet,
  onAccountsChangedWallet,
  onChainChangedWallet
} = useWallet();
const { address, balance, chainId, isActivated, avatar } = useEthers()
const { onProviderActivated, onProviderChanged, onProviderDeactivated } = useEthersHooks()

onDisconnectWallet(() => {
  console.log('disconnect')
})

onAccountsChangedWallet(() => {
  console.log('accounts changed')
})

onChainChangedWallet((chainId: any) => {
  console.log('chain changed', chainId)
})

const metamaskConnector = new MetaMaskConnector();

const connectors = [
  metamaskConnector,
  new WalletConnectConnector({
    qrcode: true,
    rpc: {
      1: `https://mainnet.infura.io/v3/${infuraId}`,
      3: `https://ropsten.infura.io/v3/${infuraId}`,
      4: `https://rinkeby.infura.io/v3/${infuraId}`,
      5: `https://goerli.infura.io/v3/${infuraId}`,
      42: `https://kovan.infura.io/v3/${infuraId}`,
    },
  }),
  new CoinbaseWalletConnector({
    appName: 'Vue Dapp',
    jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
  }),
]

const supportedChainId = [
  ChainId.Mainnet,
  ChainId.Ropsten,
  ChainId.Rinkeby,
  ChainId.Goerli,
  ChainId.Kovan,
  ChainId.HECOTestnet
]
const selectedChainId = ref(0)

onProviderActivated((hook) => {
  selectedChainId.value = chainId.value as number
})

const isChainChanged = ref(false)
onProviderChanged((hook) => {
  selectedChainId.value = chainId.value as number
  isChainChanged.value = true
})

// For turning back to previous chainId without calling switchChain() again
const switchError = ref(false)
watch(selectedChainId, async (val, oldVal) => {
  if (oldVal === 0) return // ignore initial change
  if (switchError.value) {
    switchError.value = false
    return
  }
  // if (isChainChanged.value) {
  //   isChainChanged.value = false
  //   return
  // }

  try {
    if (wallet.connector) {
      await wallet.connector.switchChain!(val)
    }
  } catch (e: any) {
    switchError.value = true
    selectedChainId.value = oldVal
    console.error(e)
  }
})

// onBeforeMount(async () => {
//   connectWith(metamaskConnector);
// });

</script>

<template>
  <Header></Header>

  <!-- banner -->
  <div class="mt-30 flex flex-col items-center">
    <img class="w-90" src="./assets/logo.png" alt="logo" />
    <p class="bold text-md px-4 sm:text-xl">
      Vue 3 library for building Dapps on Ethereum
    </p>
  </div>

  <!-- connect -->
  <div class="mt-10 flex flex-col justify-center items-center">
    <p v-if="wallet.error" class="text-red-500">{{ wallet.error }}</p>

    <div v-if="isActivated" class="text-center">
      <p>{{ shortenAddress(address) }}</p>
      <p>{{ displayEther(balance) }} ETH</p>
      <div v-html="avatar.outerHTML"></div>

      <!-- Network -->
      <Dropdown
        class="mt-2"
        :options="supportedChainId"
        v-model:selected="selectedChainId"
        :filter-fn="displayChainName"
      ></Dropdown>
    </div>

    <div class="m-4">
      <button
        @click="isActivated ? disconnectWallet() : openBoard()"
        class="btn"
        :disabled="wallet.status === ConnectionStatus.CONNECTING"
      >
        {{
          wallet.status === ConnectionStatus.CONNECTED
            ? 'Disconnect'
            : wallet.status === ConnectionStatus.CONNECTING
              ? 'Connecting...'
              : wallet.status === ConnectionStatus.LOADING
                ? 'Loading...'
                : 'Connect'
        }}
      </button>
    </div>
  </div>

  <vd-board :connectors="connectors" dark>
    <!-- <template #loading>
      <div v-if="wallet.status === ConnectionStatus.LOADING"></div>
    </template> -->
  </vd-board>
</template>
