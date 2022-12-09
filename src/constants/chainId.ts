export enum ChainId {
  Hardhat = 31337,
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  xDai = 100,
  Rinkarby = 421611,
  Arbitrum = 42161,
  Polygon = 137,
  HECOTestnet = 256,
  GonChain = 10024
}

export const DEFAULT_INFURA_ID = '863c34ed0c4040409f4f61fecd08491e';

export const CONFIG_RPC_FOR_INFURA_IDS = {
  [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${DEFAULT_INFURA_ID}`,
  [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${DEFAULT_INFURA_ID}`,
  [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${DEFAULT_INFURA_ID}`,
  [ChainId.Goerli]: `https://goerli.infura.io/v3/${DEFAULT_INFURA_ID}`,
  [ChainId.Kovan]: `https://kovan.infura.io/v3/${DEFAULT_INFURA_ID}`,
  [ChainId.GonChain]: `https://node1.testnet.gaiaopen.network`,
}

export const CHAIN_NAMES = {
  [ChainId.Hardhat]: 'Hardhat',
  [ChainId.Mainnet]: 'Mainnet',
  [ChainId.Ropsten]: 'Ropsten',
  [ChainId.Kovan]: 'Kovan',
  [ChainId.Rinkeby]: 'Rinkeby',
  [ChainId.Goerli]: 'Goerli',
  [ChainId.xDai]: 'xDai',
  [ChainId.Rinkarby]: 'Rinkarby',
  [ChainId.Arbitrum]: 'Arbitrum',
  [ChainId.Polygon]: 'Polygon',
  [ChainId.HECOTestnet]: 'Testnet',
  [ChainId.GonChain]: 'GonChain'
}

// @todo add other network details. Refer to https://chainlist.org/
export const NETWORK_DETAILS = {
  [ChainId.Arbitrum]: {
    chainId: '0x' + ChainId.Arbitrum.toString(16),
    chainName: 'Arbitrum',
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  [ChainId.Rinkarby]: {
    chainId: '0x' + ChainId.Rinkarby.toString(16),
    chainName: 'RinkArby',
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://rinkeby-explorer.arbitrum.io'],
  },
  [ChainId.xDai]: {
    chainId: '0x' + ChainId.xDai.toString(16),
    chainName: 'xDAI',
    nativeCurrency: {
      symbol: 'xDAI',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.xdaichain.com'],
    blockExplorerUrls: ['https://blockscout.com/poa/xdai'],
  },
  [ChainId.Polygon]: {
    chainId: '0x' + ChainId.Polygon.toString(16),
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  [ChainId.HECOTestnet]: {
    chainId: '0x' + ChainId.HECOTestnet.toString(16),
    chainName: 'Huobi ECO Chain Testnet',
    nativeCurrency: {
      symbol: 'htt',
      decimals: 18,
    },
    rpcUrls: ['https://http-testnet.hecochain.com'],
    blockExplorerUrls: ['https://testnet.hecoinfo.com'],
  },
  [ChainId.GonChain]: {
    chainId: '0x' + ChainId.GonChain.toString(16),
    chainName: 'Gon Chain',
    nativeCurrency: {
      symbol: 'GT',
      decimals: 18,
    },
    rpcUrls: ['https://node1.testnet.gaiaopen.network'],
    blockExplorerUrls: ['https://gonscan.com'],
  },
}
