import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';
import { Box, BoxBody, BoxHeader, BoxTitle } from 'src/components/Box';
import NumberDisplay from 'src/components/Number';
import { ExternalLinks } from 'src/config';
import styled from 'styled-components';
interface HowItWorksProps {
  costPerTicket: BigNumber;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ costPerTicket }) => {
  return (
    <Box>
      <BoxHeader bg="#e7faff">
        <BoxTitle>How It Works</BoxTitle>
      </BoxHeader>
      <BoxBody>
        <StyledWrapper>
          <StyledItem>
            <StyledOrder>1</StyledOrder>
            <StyledContent>
              One ticket price is{' '}
              <NumberDisplay
                value={costPerTicket}
                decimals={18}
                precision={0}
                keepZeros={true}
              />{' '}
              IRON.{' '}
              <a href={ExternalLinks.mintIron} target="_blank">
                Mint
              </a>{' '}
              or{' '}
              <a href={ExternalLinks.buyIron} target="_blank">
                Buy
              </a>{' '}
              IRON first.
            </StyledContent>
          </StyledItem>
          <StyledItem>
            <StyledOrder>2</StyledOrder>
            <StyledContent>
              Buy your lottery ticket with IRON. You can buy as many as you want.
            </StyledContent>
          </StyledItem>
          <StyledItem>
            <StyledOrder>3</StyledOrder>
            <StyledContent>
              Lottery draw is every day at 2PM UTC. You win if your ticket matches at least 3
              numbers.{' '}
              <a href={ExternalLinks.rules} target="_blank">
                See rules and example
              </a>
              .
            </StyledContent>
          </StyledItem>
          <StyledItem>
            <StyledOrder lastOrder>4</StyledOrder>
            <StyledContent>
              <div>Daily prize pot allocation: </div>
              <ul>
                <li>Jackpot (aka "Match 5"): 80% </li>
                <li>Match 4: 10% </li>
                <li>Match 3: 10% </li>
              </ul>
              In case of more winners in a category, the pot will be divided.
            </StyledContent>
          </StyledItem>
        </StyledWrapper>
      </BoxBody>
    </Box>
  );
};

const StyledWrapper = styled.div`
  padding: 12px 25px;
  @media (max-width: 768px) {
    padding: 12px 1px;
  }
`;

const StyledItem = styled.div`
  display: flex;
  align-items: start;
  :not(:last-child) {
    padding-bottom: 30px;
  }
  @media (max-width: 768px) {
    min-height: 70px;
    :not(:last-child) {
      padding-bottom: 20px;
    }
  }
`;

const StyledOrder = styled.div<{ lastOrder?: boolean }>`
  width: 31px;
  height: 31px;
  border-radius: 50%;
  border: 2px solid #400003;
  background-color: ${({ theme }) => theme.color.blue[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
  ${({ lastOrder }) =>
    !lastOrder &&
    `:after {
      content: '';
      height: 30px;
      width: 1px;
      border-right: 2px dashed #400003;
      top: 28px;
      position: absolute;
      @media (max-width: 768px) {
        height: 60px;
      }
    }`}
`;

const StyledContent = styled.div`
  margin-left: 15px;
  color: #400003;
  font-weight: 500;
  flex: 1;
  a {
    color: ${(p) => p.theme.color.orange[500]};
    font-weight: 600;
    &:hover {
      color: ${(p) => p.theme.color.primary.main};
    }
  }
  @media (max-width: 768px) {
    margin-left: 8px;
  }
  ul {
    margin: 0;
  }
`;

export default HowItWorks;
