import { reactive, markRaw } from 'vue'
import { providers } from 'ethers'
import { Connector } from '../wallets'
import { useEthers } from './useEthers'

const { onActivate, onDeactivate } = useEthers()

// export type ConnectionStatus = 'none' | 'connecting' | 'loading' | 'connected'
export enum ConnectionStatus {
  NONE,
  CONNECTING,
  LOADING,
  CONNECTED,
}

const wallet = reactive({
  connector: null as Connector | null,
  provider: null as providers.ExternalProvider | null,
  code: 0,
  error: '',
  status: ConnectionStatus.NONE,
})

export type OnDisconnectCallback = (...args: any[]) => void
export type OnAccountsChangedCallback = (accounts: string[]) => void
export type OnChainChangedCallback = (chainId: number) => void

const callbacks = reactive({
  onDisconnectCallback: null as OnDisconnectCallback | null,
  onAccountsChangedCallback: null as OnAccountsChangedCallback | null,
  onChainChangedCallback: null as OnChainChangedCallback | null,
})

export type useWalletOptions = {
  useEthers: boolean
}

export function useWallet(options: useWalletOptions = { useEthers: true }) {
  const clearWallet = () => {
    wallet.connector = null
    wallet.provider = null
    wallet.code = 0;
    wallet.error = ''
    wallet.status = ConnectionStatus.NONE

    if (options.useEthers) {
      onDeactivate()
    }
  }

  async function reactivate() {
    wallet.status = ConnectionStatus.LOADING
    try {
      await onActivate(wallet.provider!)
    } catch (err: any) {
      clearWallet()
      wallet.code = err.code
      wallet.error = err.message
      throw new Error(err)
    }
    wallet.status = ConnectionStatus.CONNECTED
  }

  async function connectWithWallet(connector: Connector) {
    wallet.status = ConnectionStatus.CONNECTING
    wallet.code = 0
    wallet.error = ''

    try {
      if (!connector) throw new Error('Incorrect connector argument')

      const { provider } = await connector.connect()

      wallet.connector = markRaw(connector)
      wallet.provider = markRaw(provider)

      wallet.code = 0
      wallet.error = ''

      if (options.useEthers) {
        wallet.status = ConnectionStatus.LOADING
        await onActivate(wallet.provider!)
      }
    } catch (err: any) {
      await disconnectWallet() // will also clearWallet()
      wallet.code = err.code
      wallet.error = err.message
      throw new Error(err)
    }

    wallet.status = ConnectionStatus.CONNECTED

    // subscribe events
    if (wallet.connector) {
      wallet.connector.onDisconnect((...args: any[]) => {
        callbacks.onDisconnectCallback &&
          callbacks.onDisconnectCallback!(...args)
        /**
         * Exclude metamask to disconnect on this event
         * @note MetaMask disconnect event would be triggered when the specific chain changed (like L2 network),
         * so if we disconnect in this case, it would fail to reactivate ethers when chain changed
         * because the wallet state was cleared.
         * @todo better solution
         */
        if (wallet.connector?.name === 'metaMask') {
          return
        }
        disconnectWallet()
      })
    }

    if (wallet.connector) {
      wallet.connector.onAccountsChanged(async (accounts: string[]) => {
        callbacks.onAccountsChangedCallback &&
          callbacks.onAccountsChangedCallback!(accounts)
        if (options.useEthers) {
          await reactivate()
        }
      })
    }

    if (wallet.connector) {
      wallet.connector.onChainChanged(async (chainId: number) => {
        callbacks.onChainChangedCallback &&
          callbacks.onChainChangedCallback!(chainId)
        if (options.useEthers) {
          await reactivate()
        }
      })
    }
  }

  async function disconnectWallet() {
    if (wallet.connector) {
      try {
        await wallet.connector.disconnect()
      } catch (err: any) {
        clearWallet()
        throw new Error(err)
      }
    }
    clearWallet()
  }

  function onDisconnectWallet(callback: OnDisconnectCallback) {
    callbacks.onDisconnectCallback = callback
  }

  function onAccountsChangedWallet(callback: OnAccountsChangedCallback) {
    callbacks.onAccountsChangedCallback = callback
  }

  function onChainChangedWallet(callback: OnChainChangedCallback) {
    callbacks.onChainChangedCallback = callback
  }

  return {
    wallet,

    connectWithWallet,
    disconnectWallet,

    onDisconnectWallet,
    onAccountsChangedWallet,
    onChainChangedWallet,
  }
}
