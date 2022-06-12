import { computed, markRaw, ref, Ref } from 'vue'
import {
  Web3Provider,
  Network,
  ExternalProvider,
} from '@ethersproject/providers'
import { BigNumber, Signer } from 'ethers'
import jazzicon from '@metamask/jazzicon'

export type { Web3Provider, Signer, Network }

export const DEFAULT_FETCHING_WALLET_DATA = 10000

const isActivated = ref(false)
const provider = ref<Web3Provider | null>(null)
const signer = ref<Signer | null>(null)
const network = ref<Network | null>(null)
const address = ref('')
const balance = ref<bigint>(BigInt(0))
const avatar = ref<HTMLDivElement | null>(null)

const onDeactivate = () => {
  isActivated.value = false
  provider.value = null
  signer.value = null
  network.value = null
  address.value = ''
  balance.value = BigInt(0)
  avatar.value = null;
}

async function onActivate(externalProvider: ExternalProvider) {
  if (!externalProvider)
    throw new Error('Failed to activate ethers: provider not found')

  // Test loading
  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(true)
  //   }, 2000)
  // })

  const _provider = new Web3Provider(externalProvider)
  const _signer = _provider.getSigner()

  /**
   * @issue #27
   * @dev Catch error if walletConnect not connected because of invalid infura id.
   * if you provide an invalid infura id, you can still open the qrcode but can't connect to wallet.
   * WalletConnect will throw error and keep polling until timeout as follows.
   */
  let _network = null
  let _address = ''
  let _balance = BigNumber.from(0)
  let _avatar = null;
  const getData = (timeout: number = DEFAULT_FETCHING_WALLET_DATA) => {
    return new Promise(async (resolve: (val: any[]) => void, reject) => {
      try {
        setTimeout(() => {
          reject('Failed to activate ethers: timeout')
        }, timeout)
        _network = await _provider.getNetwork()
        _address = await _signer.getAddress()
        _avatar = jazzicon(32, parseInt(_address.slice(2, 10), 16))
        // const iconNode = jazzicon(64, parseInt(_address.slice(2, 10), 16))
        // _avatar = document.createElement('div').appendChild(iconNode);
        _balance = await _signer.getBalance()
        resolve([_network, _address, _balance])
      } catch (err: any) {
        reject(err)
      }
    })
  }

  try {
    await getData()
  } catch (err: any) {
    throw new Error(err)
  }

  provider.value = markRaw(_provider)
  signer.value = markRaw(_signer)
  network.value = _network
  address.value = _address
  balance.value = _balance.toBigInt()
  avatar.value = _avatar

  isActivated.value = true
}

export function useEthers() {
  const chainId = computed(() => network.value?.chainId)

  return {
    // state
    isActivated,
    provider: provider as Ref<Web3Provider | null>, // for fixing index.d.ts compiled error, see issue/10:
    signer: signer as Ref<Signer | null>,
    network,
    address,
    balance,
    avatar,

    // getters
    chainId,

    // methods
    onActivate,
    onDeactivate,
  }
}
