import { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import useDiamondHand from 'src/hooks/useDiamondHand';
import useMyTicket from 'src/hooks/useMyTicket';
import useRoundInfo from './useRoundInfo';
import useHandleTransactionReceipt from 'src/hooks/useHandleTransactionReceipt';
import useMyTicketNumber, { Ticket } from 'src/hooks/useMyTicketNumber';
import useMulticall from 'src/hooks/useMulticall';

const countMatch = (a: number[], b: number[]) => {
  return a.filter((x) => b.includes(x)).length;
};

type Level = 'jackpot' | 'match4' | 'match3' | 'lost';

const prizeIndex = (x: Level): number => {
  return {
    jackpot: 0,
    match4: 1,
    match3: 2,
    lost: undefined,
  }[x];
};

const useMyRoundTicket = (roundId?: number) => {
  const dh = useDiamondHand();
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const myTicket = useMyTicket(roundId);
  const tickets = useMyTicketNumber(myTicket);
  const lotteryInfo = useRoundInfo(roundId);
  const [filteredTickets, setFilteredTickets] = useState<Record<Level, Ticket[]>>();
  const [claimable, setClaimable] = useState<Record<Level, BigNumber>>();
  const [totalClaimable, setTotalClaimable] = useState<BigNumber>();
  const [winCount, setWinCount] = useState(0);
  const [isCanClaimReward, setIsCanClaimReward] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const multicall = useMulticall();

  useEffect(() => {
    if (!dh || !filteredTickets) return;
    const jackpotIds = filteredTickets.jackpot.map((t) => t.id.toNumber());
    const match3Ids = filteredTickets.match3.map((t) => t.id.toNumber());
    const match4Ids = filteredTickets.match4.map((t) => t.id.toNumber());
    const _ticketIds = jackpotIds.concat(match4Ids).concat(match3Ids);
    multicall(
      (_ticketIds || []).map((tid) => ({
        contract: dh.TICKET.contract,
        method: 'getTicketClaimStatus',
        params: [tid],
      })),
    ).then((data) => {
      const status = data?.map((s) => s[0]);
      setIsCanClaimReward(status.includes(false));
    });
  }, [filteredTickets, dh, multicall]);

  const calculatePrize = useCallback(
    (ticket: number[]) => {
      if (!lotteryInfo?.winningNumbers || !ticket) {
        return;
      }
      const size = lotteryInfo?.winningNumbers.length;
      const pbMatch = ticket[size - 1] === lotteryInfo?.winningNumbers[size - 1];
      const match = countMatch(
        ticket.slice(0, size - 1),
        lotteryInfo?.winningNumbers.slice(0, size - 1),
      );

      if (match === 4 && pbMatch) {
        return 5;
      }

      return match;
    },
    [lotteryInfo?.winningNumbers],
  );

  const calculateClaimable = useCallback(
    (numberOfTickets: number, level: Level) => {
      if (!lotteryInfo?.winners) {
        return BigNumber.from(0);
      }
      const index = prizeIndex(level);
      if (typeof index === 'undefined' || lotteryInfo.winners[index]?.eq(0)) {
        return BigNumber.from(0);
      }
      return lotteryInfo?.prizes[index].mul(numberOfTickets).div(lotteryInfo.winners[index]);
    },
    [lotteryInfo?.prizes, lotteryInfo?.winners],
  );

  useEffect(() => {
    setLoading(true);
    if (!tickets) {
      return;
    }
    const filtered = {
      jackpot: [],
      match4: [],
      match3: [],
      lost: [],
    } as Record<string, Ticket[]>;
    tickets.forEach((item) => {
      const match = calculatePrize(item.numbers);
      switch (match) {
        case 5:
          return filtered.jackpot.push(item);

        case 4:
          return filtered.match4.push(item);

        case 3:
          return filtered.match3.push(item);

        default:
          filtered.lost.push(item);
      }
    });

    const claimableAmounts = {} as Record<Level, BigNumber>;
    let total = BigNumber.from(0);
    Object.entries(filtered).forEach(([level, tickets]) => {
      const amount = calculateClaimable(tickets.length, level as Level);
      claimableAmounts[level as Level] = amount;
      total = total.add(amount);
    });

    setFilteredTickets(filtered as any);
    setClaimable(claimableAmounts);
    setTotalClaimable(total);
    setWinCount(tickets.length - filtered.lost.length);
    setLoading(false);
  }, [calculateClaimable, calculatePrize, tickets]);

  const winNumbers = useMemo(() => {
    if (!lotteryInfo) return [];
    return lotteryInfo.winningNumbers.slice(0, 4);
  }, [lotteryInfo]);

  const powerBall = useMemo(() => {
    if (!lotteryInfo) return null;
    return lotteryInfo.winningNumbers[4];
  }, [lotteryInfo]);

  const claimReward = useCallback(() => {
    if (!dh || !roundId || !myTicket || !filteredTickets) return;

    const tickets = [
      ...filteredTickets.jackpot.map((t) => t.id),
      ...filteredTickets.match4.map((t) => t.id),
      ...filteredTickets.match3.map((t) => t.id),
    ];
    if (!tickets.length) {
      return;
    }
    handleTransactionReceipt(
      dh.LOTTERY.batchClaimRewards(BigNumber.from(roundId), tickets),
      `Claim reward`,
    );
  }, [dh, roundId, myTicket, filteredTickets, handleTransactionReceipt]);

  return {
    filteredTickets,
    claimable,
    totalClaimable,
    claimReward,
    winCount,
    winNumbers,
    powerBall,
    isCanClaimReward,
    loading,
  };
};

export default useMyRoundTicket;
