import { Configuration } from './diamondhand/config';
import deploymentLocal from './diamondhand/deployments/deployments.localhost.json';
import deploymentTestnet from './diamondhand/deployments/deployments.testnet.json';
import deploymentMainnet from './diamondhand/deployments/deployments.mainnet.json';

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: 31337,
    etherscanUrl: 'https://bscscan.com',
    defaultProvider: 'http://localhost:8545',
    deployments: deploymentLocal,
    pollingInterval: 5 * 1000,
    refreshInterval: 10 * 1000,
    defaultSlippageTolerance: 0.001,
    gasLimitMultiplier: 1.1,
    maxBalanceRefresh: 1000000,
    maxUnclaimedRefresh: 5,
    backendUrl: 'https://api.diamondhand.fi',
    backendDisabled: false,
    abis: {
      Lottery: deploymentLocal.Lottery.abi,
      Ticket: deploymentLocal.Ticket.abi,
      MockIRON: deploymentLocal.MockIRON.abi,
      MockLink: deploymentLocal.MockLink.abi,
      TaxService: deploymentLocal.TaxService.abi,
    },
    addresses: {
      Lottery: deploymentLocal.Lottery.address,
      Ticket: deploymentLocal.Ticket.address,
      MockIRON: deploymentLocal.MockIRON.address,
      Multicall: deploymentLocal.Multicall.address,
      PrizeReservePool: deploymentLocal.PrizeReservePool.address,
      BurnSteelPool: deploymentLocal.BurnSteelPool.address,
      BurnDndPool: deploymentLocal.BurnDndPool.address,
      RandomNumberGenerator: deploymentLocal.RandomNumberGenerator.address,
      MockLink: deploymentLocal.MockLink.address,
      TaxService: deploymentLocal.TaxService.address,
    },
    admins: [
      '0x03DbFDC27697b311B38C1934c38bD97905C46Ed0',
      '0x62cA555de2D65f8e9D45a9B3d5C1b92aC1a64ecc',
      '0xfDde60b51F8b16f2549850741015324Da346Db46',
      '0x5AeBdE597752d689132Dc64D093ff4b09067e9e6',
      '0xa3A502569BF1bfBF7b361964d61335a7530D39e8',
      '0xD1d075DB389919a6985dDc9B32b5f3Ad6f0869cd',
    ],
  },
  testnet: {
    chainId: 97,
    etherscanUrl: 'https://testnet.bscscan.com',
    defaultProvider: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    deployments: deploymentTestnet,
    pollingInterval: 5 * 1000,
    refreshInterval: 10 * 1000,
    defaultSlippageTolerance: 0.001,
    gasLimitMultiplier: 1.1,
    maxBalanceRefresh: 1000000,
    maxUnclaimedRefresh: 5,
    backendUrl: 'https://api.diamondhand.fi',
    backendDisabled: false,
    abis: {
      Lottery: deploymentTestnet.Lottery.abi,
      Ticket: deploymentTestnet.Ticket.abi,
      MockIRON: deploymentTestnet.MockIRON.abi,
      TaxService: deploymentTestnet.TaxService.abi,
    },
    addresses: {
      Lottery: deploymentTestnet.Lottery.address,
      Ticket: deploymentTestnet.Ticket.address,
      MockIRON: deploymentTestnet.MockIRON.address,
      Multicall: '0xADdeE055938ff245de8a89DB9D2Df3BB5bb966Db',
      MockLink: '	0x84b9b910527ad5c03a9ca831909e21e236ea7b06',
      TaxService: deploymentTestnet.TaxService.address,
      PrizeReservePool: deploymentTestnet.PrizeReservePool.address,
    },
    admins: [
      '0x03DbFDC27697b311B38C1934c38bD97905C46Ed0',
      '0x62cA555de2D65f8e9D45a9B3d5C1b92aC1a64ecc',
      '0xfDde60b51F8b16f2549850741015324Da346Db46',
      '0x5AeBdE597752d689132Dc64D093ff4b09067e9e6',
      '0xa3A502569BF1bfBF7b361964d61335a7530D39e8',
      '0xD1d075DB389919a6985dDc9B32b5f3Ad6f0869cd',
    ],
  },
  mainnet: {
    chainId: 56,
    etherscanUrl: 'https://bscscan.com',
    defaultProvider: 'https://bsc-dataseed.binance.org',
    deployments: deploymentMainnet,
    pollingInterval: 5 * 1000,
    refreshInterval: 10 * 1000,
    defaultSlippageTolerance: 0.001,
    gasLimitMultiplier: 1.1,
    maxBalanceRefresh: 1000000,
    abis: {
      Lottery: deploymentMainnet.Lottery.abi,
      Ticket: deploymentMainnet.Ticket.abi,
      TaxService: deploymentMainnet.TaxService.abi,
    },
    addresses: {
      Lottery: deploymentMainnet.Lottery.address,
      Ticket: deploymentMainnet.Ticket.address,
      MockIRON: '0x7b65B489fE53fCE1F6548Db886C08aD73111DDd8',
      Multicall: '0xCE9197219344FA32729f7a9aBE28Fe3bf1c81EC9',
      MockLink: '0x404460c6a5ede2d891e8297795264fde62adbb75',
      BurnSteelPool: '0xf5A97e1E6D0330F999D7Df556968ac121A170225',
      BurnDndPool: '0xb69FE250Ebd9738C4DBC8c5028F0126A707561aC',
      TaxService: deploymentMainnet.TaxService.address,
    },
    admins: [
      '0x03DbFDC27697b311B38C1934c38bD97905C46Ed0',
      '0x62cA555de2D65f8e9D45a9B3d5C1b92aC1a64ecc',
      '0xfDde60b51F8b16f2549850741015324Da346Db46',
      '0x5AeBdE597752d689132Dc64D093ff4b09067e9e6',
      '0xa3A502569BF1bfBF7b361964d61335a7530D39e8',
      '0xD1d075DB389919a6985dDc9B32b5f3Ad6f0869cd',
    ],
  },
};

export const ExternalLinks = {
  twitter: 'https://twitter.com/IronFinance',
  documentations: 'https://docs.diamondhand.fi',
  codes: 'https://github.com/ironfinance',
  discord: 'https://discord.gg/HuekxzYj3p',
  medium: 'https://medium.com/@ironfinance',
  telegram: 'https://t.me/ironfinance',
  buyIron:
    'https://bsc.valuedefi.io/#/vswap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=0x7b65b489fe53fce1f6548db886c08ad73111ddd8',
  mintIron:
    'https://app.iron.finance/bank?action=mint&pool=0xFE6F0534079507De1Ed5632E3a2D4aFC2423ead2',
  rules: 'https://docs.iron.finance/products/dragonball-lottery',
};

const env: string = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';

const GATrackingCodes: Record<string, string> = {
  deployment: 'G-1WCVVE43MG',
  kovan: 'G-1WCVVE43MG',
  production: 'G-F9BRXKJ1CP',
  mainnet: 'G-F9BRXKJ1CP',
};

export const GATrackingCode = GATrackingCodes[env];

export const getDefaultConfiguration = () => {
  // config used when no ethereum detected
  return configurations[env];
};
