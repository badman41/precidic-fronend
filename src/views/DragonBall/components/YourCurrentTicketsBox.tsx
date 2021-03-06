import React, { useMemo } from 'react';
import { Box, BoxHeader, BoxTitle, BoxBody } from 'src/components/Box';
import styled from 'styled-components';
import ImgTicket from 'src/assets/img/ticket.svg';
import { NavLink } from 'react-router-dom';
import { BigNumber } from '@ethersproject/bignumber';
import useMyTicket from 'src/hooks/useMyTicket';
import NumberDisplay from 'src/components/Number';
import { CountdownClock } from 'src/components/CountdownClock/CountdownClock';
import isPast from 'date-fns/isPast';
import { useWeb3React } from '@web3-react/core';
import useTryConnect from 'src/hooks/useTryConnect';

interface YourCurrentTicketsBoxProps {
  startingTimestamp: Date;
  closingTimestamp: Date;
  lotteryId: number;
  costPerTicket: BigNumber;
}

const YourCurrentTicketsBox: React.FC<YourCurrentTicketsBoxProps> = ({
  startingTimestamp,
  closingTimestamp,
  lotteryId,
  costPerTicket,
}) => {
  const myTickets = useMyTicket(lotteryId);
  const { account } = useWeb3React();
  const { tryConnect } = useTryConnect();

  const notStarted = useMemo(() => {
    if (!startingTimestamp) {
      return false;
    }
    return !isPast(startingTimestamp);
  }, [startingTimestamp]);

  const isPastClosing = useMemo(() => {
    return isPast(closingTimestamp);
  }, [closingTimestamp]);

  return (
    <Box>
      <BoxHeader bg="#ffbbe2">
        <BoxTitle>Your tickets in this round</BoxTitle>
      </BoxHeader>
      <BoxBody>
        {notStarted ? (
          <StyledCountdown>
            <img className="icon-ticket" src={ImgTicket} />
            <StyledCountdownLabel>You can buy tickets in</StyledCountdownLabel>
            <StyledCountdownClock>
              <CountdownClock to={startingTimestamp} fontSize="32px"></CountdownClock>
            </StyledCountdownClock>
          </StyledCountdown>
        ) : (
          <>
            <StyledTicketCount>
              <img className="icon-ticket" src={ImgTicket} />
              {account && (
                <div className="label-ticket">
                  You have <span className="label-ticket-count">{myTickets?.length ?? 0}</span>{' '}
                  tickets
                </div>
              )}
            </StyledTicketCount>
            <StyledPrice>
              <span className="number">1</span> Ticket ={' '}
              <span className="number">
                <NumberDisplay value={costPerTicket} decimals={18} precision={2} />
              </span>{' '}
              IRON
            </StyledPrice>
            {account ? (
              <StyledButtons>
                <StyledNavLink to={`/ticket?lotteryId=${lotteryId}`}>
                  View Tickets
                </StyledNavLink>
                <StyledNavLink active="true" to="/buy" disabled={isPastClosing}>
                  Buy Tickets
                </StyledNavLink>
              </StyledButtons>
            ) : (
              <StyledButton onClick={tryConnect}>Connect Your Wallet</StyledButton>
            )}
          </>
        )}
      </BoxBody>
    </Box>
  );
};

const StyledNavLink = styled(NavLink)<{ active?: string; disabled?: boolean }>`
  font-size: 16px;
  appearance: none;
  background-color: ${({ active, theme, disabled }) =>
    disabled ? theme.color.grey[400] : active ? theme.color.green[100] : 'transparent'};
  font-family: ${(p) => p.theme.font.heading};
  color: ${({ disabled, theme }) =>
    disabled ? theme.color.secondary : theme.color.primary.main};
  border: solid 3px
    ${({ disabled, theme }) => (disabled ? theme.color.secondary : theme.color.primary.main)};
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  cursor: pointer;
  transition: ease-in-out 100ms;
  text-decoration: none;
  &:hover {
    background-color: ${(p) => p.theme.color.bg};
  }
`;

const StyledButton = styled.button`
  font-size: 16px;
  appearance: none;
  background-color: ${({ theme }) => theme.color.white};
  font-family: ${(p) => p.theme.font.heading};
  color: ${({ disabled, theme }) =>
    disabled ? theme.color.secondary : theme.color.primary.main};
  border: solid 3px ${({ theme }) => theme.color.primary.main};
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  cursor: pointer;
  transition: ease-in-out 100ms;
  text-decoration: none;
  margin-left: auto;
  margin-right: auto;
  &:hover {
    background-color: ${(p) => p.theme.color.bg};
  }
`;

const StyledCountdown = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledCountdownLabel = styled.div`
  display: flex;
  margin-top: 20px;
`;

const StyledCountdownClock = styled.div`
  color: ${(p) => p.theme.color.green[600]};
`;

const StyledTicketCount = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 25px 0 0 0;
  .icon-ticket {
    margin-bottom: 10px;
  }
  .label-ticket {
    font-size: 28px;
    .label-ticket-count {
      font-size: 34px;
      font-weight: 700;
    }
  }
  @media (max-width: 768px) {
    .label-ticket {
      font-size: 26px;
    }
  }
`;

const StyledButtons = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  padding: 0 15px 10px;
  @media (max-width: 768px) {
    display: block;
    padding: 0 60px;
    a {
      margin-bottom: 12px;
    }
  }
`;
const StyledPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  .number {
    margin-right: 3px;
    margin-left: 3px;
    font-weight: 700;
  }
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

export default YourCurrentTicketsBox;
