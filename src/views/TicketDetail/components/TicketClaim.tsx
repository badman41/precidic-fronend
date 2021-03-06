import React from 'react';
import NumberDisplay from 'src/components/Number';
import styled from 'styled-components';
import useMyRoundTicket from '../hooks/useMyRoundTicket';
import LostTicketTable from './LostTicketTable';
import TicketNumber from './TicketNumber';

type TicketClaimProps = {
  isCloseRound?: boolean;
  roundId?: number;
};

const TicketClaim: React.FC<TicketClaimProps> = ({ isCloseRound, roundId }) => {
  const {
    winCount,
    filteredTickets,
    totalClaimable,
    claimReward,
    claimable,
    powerBall,
    winNumbers,
    isCanClaimReward,
    loading,
  } = useMyRoundTicket(roundId);

  return (
    <>
      {isCloseRound && (
        <StyledContainer>
          <div className="title">You have {winCount} winning tickets in this round.</div>
          <div className="total-reward">
            Total Prize:
            <span>
              &nbsp;
              <NumberDisplay value={totalClaimable} decimals={18} precision={2} />
              &nbsp;
            </span>
            <span className="symbol">IRON</span>
          </div>
          {winCount > 0 && (
            <StyledClaim>
              {filteredTickets?.jackpot?.length > 0 && (
                <StyledWinTicket>
                  <StyledWinTitle>
                    Jackpot:&nbsp;
                    <div className="value">
                      <NumberDisplay value={claimable?.jackpot} decimals={18} precision={2} />{' '}
                      IRON
                    </div>
                  </StyledWinTitle>
                  {filteredTickets?.jackpot?.map((item, index) => (
                    <TicketNumber
                      powerBall={isCloseRound ? powerBall : undefined}
                      winNumber={isCloseRound ? winNumbers : undefined}
                      key={index}
                      ticket={item.numbers}
                    />
                  ))}
                </StyledWinTicket>
              )}
              {filteredTickets?.match4?.length > 0 && (
                <StyledWinTicket>
                  <StyledWinTitle>
                    Match four:&nbsp;
                    <div className="value">
                      <NumberDisplay value={claimable?.match4} decimals={18} precision={2} />{' '}
                      IRON
                    </div>
                  </StyledWinTitle>
                  {filteredTickets?.match4?.map((item, index) => (
                    <TicketNumber
                      powerBall={0}
                      winNumber={isCloseRound ? winNumbers : undefined}
                      key={index}
                      ticket={item.numbers}
                    />
                  ))}
                </StyledWinTicket>
              )}
              {filteredTickets?.match3?.length > 0 && (
                <StyledWinTicket>
                  <StyledWinTitle>
                    Match three:&nbsp;
                    <div className="value">
                      <NumberDisplay value={claimable?.match3} decimals={18} precision={2} />{' '}
                      IRON
                    </div>
                  </StyledWinTitle>
                  {filteredTickets?.match3?.map((item, index) => (
                    <TicketNumber
                      powerBall={0}
                      winNumber={isCloseRound ? winNumbers : undefined}
                      key={index}
                      ticket={item.numbers}
                    />
                  ))}
                </StyledWinTicket>
              )}
              <StyledClaimButton disabled={!isCanClaimReward} onClick={claimReward}>
                Claim reward
              </StyledClaimButton>
            </StyledClaim>
          )}
        </StyledContainer>
      )}
      <LostTicketTable
        data={filteredTickets?.lost}
        isCloseRound={isCloseRound}
        powerBall={powerBall}
        winNumbers={winNumbers}
        loading={loading}
      />
    </>
  );
};

export default TicketClaim;

const StyledContainer = styled.div`
  width: 100%;
  margin: 0px 58px;
  padding: 24px 0px;
  flex-direction: column;
  border-top: 1px dashed #d5d5d5;
  .title {
    font-size: 16px;
    font-weight: normal;
    text-align: center;
  }
  .total-reward {
    display: flex;
    justify-content: center;
    align-items: baseline;
    font-size: 24px;
    font-weight: bold;
    color: #400003;
    span {
      font-size: 32px;
      font-weight: bold;
      color: #00a74c;
    }
    .symbol {
      font-size: 24px;
    }
  }
`;

const StyledClaim = styled.div`
  margin: 20px 40px 0px 40px;
  padding: 20px 32px 32px 30px;
  border: solid 1px #d5d5d5;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: 20px 10px 0px 10px;
  }
`;

const StyledWinTicket = styled.div``;

const StyledWinTitle = styled.div`
  display: flex;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: bold;
  color: #400003;
  .value {
  }
`;

const StyledClaimButton = styled.button`
  width: 100%;
  margin-top: 18px;
  border: solid 2px #460000;
  background: #00f7a4;
  font-size: 20px;
  font-weight: normal;
  color: #400003;
  font-family: ${({ theme }) => theme.font.heading};
  padding: 10px 20px;
  text-align: center;
  cursor: pointer;
  :hover {
    background-color: #ffe970;
  }
  &:disabled {
    background: #d5d5d5;
    color: #877d7d;
    cursor: not-allowed;
  }
`;
