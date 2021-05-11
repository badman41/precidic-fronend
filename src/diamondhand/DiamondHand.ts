import { Configuration } from './config';
import { BigNumber } from '@ethersproject/bignumber';
import { Signer } from '@ethersproject/abstract-signer';
import { Overrides } from '@ethersproject/contracts';
import { JsonRpcProvider, Provider } from '@ethersproject/providers';
import { Lottery } from './Lottery';
import IRON from './IRON';
import { Ticket } from './Ticket';
import { Call, multicall } from './multicall';
import LINK from './LINK';
import { TaxService } from './TaxService';
import { ConfigurationInfo } from './types';

/**
 * An API module of Diamond Hand contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class DiamondHand {
  myAccount: string;
  private defaultProvider: JsonRpcProvider;
  private signer?: Signer;
  private config: Configuration;
  private lottery: Lottery;
  private iron: IRON;
  private link: LINK;
  private ticket: Ticket;
  private taxService: TaxService;
  private multicallAddress: string;

  constructor(cfg: Configuration, provider: JsonRpcProvider) {
    const { abis, addresses } = cfg;
    this.lottery = new Lottery(abis.Lottery, addresses.Lottery, provider, this);
    this.ticket = new Ticket(abis.Ticket, addresses.Ticket, provider);
    this.iron = new IRON(abis.MockIRON, addresses.MockIRON, provider, 'IRON');
    this.link = new LINK(abis.MockLink, addresses.MockLink, provider, 'LINK');
    this.taxService = new TaxService(abis.TaxService, addresses.TaxService, provider)
    this.config = cfg;
    this.defaultProvider = provider;
    this.multicallAddress = cfg.addresses.Multicall;
  }

  public multicall(calls: Call[]) {
    return multicall(this.defaultProvider, this.multicallAddress, calls);
  }

  public get provider(): Signer | Provider {
    return this.signer || this.defaultProvider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: JsonRpcProvider, account: string) {
    this.signer = provider.getSigner(account);
    this.myAccount = account;
    this.reconnect();
  }

  lock() {
    this.signer = null;
    this.myAccount = null;
    this.reconnect();
  }

  private reconnect() {
    this.lottery.connect(this.provider);
    this.ticket.connect(this.provider);
    this.iron.connect(this.provider);
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  get LOTTERY() {
    return this.lottery;
  }

  get TICKET() {
    return this.ticket;
  }

  get IRON() {
    return this.iron;
  }

  get LINK() {
    return this.link
  }

  get TAXSERVICE() {
    return this.taxService
  }


  async getInfo() {
    const [
      [jackPotDistribution],
      [matchFourDistribution],
      [matchThreeDistribution],
      [taxRate],
      [costPerTicket],
      [maxValidRange],
      [powerBallRange],
      [reservePoolRatio],
      [burnSteelRatio],
      [burnDndRatio]
    ] = await this.multicall([
      {
        contract: this.LOTTERY.contract,
        method: 'prizeDistribution_',
        params: [0],
      },
      {
        contract: this.LOTTERY.contract,
        method: 'prizeDistribution_',
        params: [1],
      },
      {
        contract: this.LOTTERY.contract,
        method: 'prizeDistribution_',
        params: [2],
      },
      {
        contract: this.LOTTERY.contract,
        method: 'taxRate_',
      },
      {
        contract: this.LOTTERY.contract,
        method: 'costPerTicket_',
      },
      {
        contract: this.LOTTERY.contract,
        method: 'maxValidRange_',
      },
      {
        contract: this.LOTTERY.contract,
        method: 'powerBallRange_',
      },
      {
        contract: this.TAXSERVICE.contract,
        method: 'reservePoolRatio_',
      },
      {
        contract: this.TAXSERVICE.contract,
        method: 'burnSteelPoolRatio_',
      },
      {
        contract: this.TAXSERVICE.contract,
        method: 'burnDndPoolRatio_',
      },
    ]);
    const { addresses } = this.config
    const balances = await Promise.all([
      this.IRON.balanceOf(addresses.PrizeReservePool),
      this.IRON.balanceOf(addresses.BurnSteelPool),
      this.IRON.balanceOf(addresses.BurnDndPool),
      this.LINK.balanceOf(addresses.RandomNumberGenerator)
    ])
    return {
      jackPotDistribution: jackPotDistribution.div(1e4).toNumber(),
      matchFourDistribution: matchFourDistribution.div(1e4).toNumber(),
      matchThreeDistribution: matchThreeDistribution.div(1e4).toNumber(),
      taxRate: taxRate.div(1e4).toNumber(),
      costPerTicket,
      maxValidRange,
      powerBallRange,
      reservePoolRatio: reservePoolRatio.div(1e4).toNumber(),
      burnSteelRatio: burnSteelRatio.div(1e4).toNumber(),
      burnDndRatio: burnDndRatio.div(1e4).toNumber(),
      balances
    } as ConfigurationInfo
  }

  gasOptions(gas: BigNumber): Overrides {
    const multiplied = Math.floor(gas.toNumber() * this.config.gasLimitMultiplier);
    console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
    return {
      gasLimit: BigNumber.from(multiplied),
    };
  }
}
