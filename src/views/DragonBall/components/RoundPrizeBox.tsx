import React from 'react';
import { Box, BoxBody, BoxHeader, BoxTitle } from 'src/components/Box';
import styled from 'styled-components';
import { BigNumber } from 'ethers';
import ImgCup from 'src/assets/img/cup.svg';
import NumberDisplay from 'src/components/Number';

interface RoundPrizeBoxProps {
  total: BigNumber;
  prizes: BigNumber[];
  // jackpot: BigNumber;
  // matchFour: BigNumber;
  // matchThree: BigNumber;
  ticketsSold: BigNumber;
}

const RoundPrizeBox: React.FC<RoundPrizeBoxProps> = ({ total, prizes, ticketsSold }) => {
  const jackpot = prizes ? prizes[0] : null;
  const matchFour = prizes ? prizes[1] : null;
  const matchThree = prizes ? prizes[2] : null;
  return (
    <Box>
      <BoxHeader bg="#86e3ff">
        <BoxTitle>Prize pool for this round</BoxTitle>
      </BoxHeader>
      <BoxBody>
        <StyledTotal>
          <img src={ImgCup} />
          <div className="content">
            <div>Current Prize Pool</div>
            <div className="prize-value">
              <NumberDisplay value={total} decimals={18} precision={0} keepZeros={true} />
              <span className="prize-unit">IRON</span>
            </div>
          </div>
        </StyledTotal>
        <StyledPrizeTable>
          <div className="row header">
            <div className="left">Prize</div>
            <div className="right">Value</div>
          </div>
          <div className="row">
            <div className="left">Jackpot</div>
            <div className="right jackpot">
              <NumberDisplay value={jackpot} decimals={18} precision={0} keepZeros={true} />
              <span className="prize-unit">IRON</span>
            </div>
          </div>
          <div className="row">
            <div className="left">Match 4</div>
            <div className="right">
              <NumberDisplay value={matchFour} decimals={18} precision={0} keepZeros={true} />
              <span className="prize-unit">IRON</span>
            </div>
          </div>
          <div className="row">
            <div className="left">Match 3</div>
            <div className="right">
              <NumberDisplay value={matchThree} decimals={18} precision={0} keepZeros={true} />
              <span className="prize-unit">IRON</span>
            </div>
          </div>
          <div className="row row-total">
            <div className="total-ticket-sold">
              Total sold:{' '}
              <NumberDisplay value={ticketsSold} decimals={0} precision={0} keepZeros={true} />{' '}
              tickets
            </div>
          </div>
        </StyledPrizeTable>
      </BoxBody>
    </Box>
  );
};

const StyledPrizeTable = styled.div`
  .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 10px 0;
    border-bottom: dashed 1px #d5d5d5;
    &:last-child {
      border-bottom: none;
    }
    .left {
      color: ${({ theme }) => theme.color.primary.main};
      font-weight: 700;
    }
    .right {
      font-weight: 600;
      font-size: 20px;
      color: #f69963;
      .prize-unit {
        font-weight: 700;
        font-size: 0.8rem;
        margin-left: 5px;
        color: #753f41;
      }
      &.jackpot {
        color: #ff6e5e;
        font-size: 24px;
        font-weight: 700;
        line-height: 1;
      }
    }
    &.header {
      border-bottom: none;
      padding-bottom: 0;
      font-weight: 700;
      font-size: 0.85rem;
      .left,
      .right {
        font-size: 0.85rem;
        color: #753f41 !important;
      }
    }
    &.row-total {
      padding: 0;
      .total-ticket-sold {
        padding-top: 15px;
        padding-bottom: 5px;
        font-size: 1rem;
        font-weight: 700;
        text-align: center;
        margin: 0 auto;
      }
    }
  }
`;

const StyledTotal = styled.div`
  display: flex;
  align-items: flex-start;
  border-bottom: dashed 1px #d5d5d5;
  padding-top: 10px;
  padding-bottom: 15px;
  margin-bottom: 0;
  img {
    margin-top: 5px;
  }
  .content {
    margin-left: 15px;
    .prize-value {
      font-size: 2rem;
      line-height: 1.3;
      text-transform: uppercase;
      font-weight: 700;
      color: ${({ theme }) => theme.color.green[600]};
    }
    .prize-unit {
      font-size: 1.5rem;
      margin-left: 5px;
      font-weight: 800;
    }
  }
`;

export default RoundPrizeBox;
