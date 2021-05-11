import React from 'react';
import styled from 'styled-components';
import ticketGold from '../../../assets/img/ticket-gold.svg';
import ticketRed from '../../../assets/img/ticket-red.svg';
import ticketSteel from '../../../assets/img/ticket-steel.svg';
import imgTicket from '../../../assets/img/img-ticket.svg';
import bgTicket from '../../../assets/img/bg-ticket.svg';

type TicketNumberProps = {
  ticket: number[];
  isClose?: boolean;
  winNumber?: number[];
  powerBall?: number;
  isSmallSize?: boolean;
};

const TicketNumber: React.FC<TicketNumberProps> = ({
  ticket,
  isClose,
  winNumber,
  powerBall,
  isSmallSize,
}) => {
  return ticket ? (
    <StyledTicketItem isSmallSize={isSmallSize}>
      {/* <StyledTicket isSmallSize={isSmallSize}>
        <img src={imgTicket} />
      </StyledTicket> */}
      <StyledTicketNumber
        isSmallSize={isSmallSize}
        isDisable={isClose || (winNumber && !winNumber.includes(ticket[0]))}
      >
        {ticket[0]}
      </StyledTicketNumber>
      <StyledTicketNumber
        isSmallSize={isSmallSize}
        isDisable={isClose || (winNumber && !winNumber.includes(ticket[1]))}
      >
        {ticket[1]}
      </StyledTicketNumber>
      <StyledTicketNumber
        isSmallSize={isSmallSize}
        isDisable={isClose || (winNumber && !winNumber.includes(ticket[2]))}
      >
        {ticket[2]}
      </StyledTicketNumber>
      <StyledTicketNumber
        isSmallSize={isSmallSize}
        isDisable={isClose || (winNumber && !winNumber.includes(ticket[3]))}
      >
        {ticket[3]}
      </StyledTicketNumber>
      <StyledTicketNumber
        isSmallSize={isSmallSize}
        isDisable={isClose || powerBall === 0 || (powerBall && powerBall !== ticket[4])}
      >
        {ticket[4]}
      </StyledTicketNumber>
    </StyledTicketItem>
  ) : null;
};

export default TicketNumber;

const StyledTicketItem = styled.div<{ isSmallSize?: boolean }>`
  padding: ${({ isSmallSize }) => (isSmallSize ? '10px' : '16px')} 6px;
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  justify-items: center;
  align-items: center;
  border-image-source: url(${bgTicket});
  border-image-slice: 40;
  border-image-repeat: stretch;
  border-image-width: 56px;
  border-style: solid;
  margin-bottom: 20px;
  :last-child {
    margin-bottom: ${({ isSmallSize }) => (isSmallSize ? '0px' : '40px')};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: auto auto auto auto auto;
    padding: ${({ isSmallSize }) => (isSmallSize ? '10px' : '0px')} 6px;
  }
`;

const StyledTicket = styled.div<{ isSmallSize?: boolean }>`
  display: flex;
  justify-content: center;
  height: 100%;
  padding-right: 10px;
  border-right: ${({ isSmallSize }) => (isSmallSize ? '1px' : '0px')} dashed #ddd;
  img {
    width: ${({ isSmallSize }) => (isSmallSize ? '24px' : '36px')};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: ${({ isSmallSize }) => (isSmallSize ? 'flex' : 'none')};
  }
`;

const StyledTicketNumber = styled.div<{ isDisable?: boolean; isSmallSize?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px ${({ isSmallSize }) => (isSmallSize ? '7px' : '20px')};
  width: ${({ isSmallSize }) => (isSmallSize ? '30px' : '70px')};
  height: ${({ isSmallSize }) => (isSmallSize ? '30px' : '70px')};
  font-size: ${({ isSmallSize }) => (isSmallSize ? '16px' : '29px')};
  font-weight: bold;
  color: ${({ isDisable }) => (isDisable ? '#8c8c8b' : '#400003')};
  background-image: url(${({ isDisable }) => (!isDisable ? ticketGold : ticketSteel)});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  &:last-child {
    background-image: url(${({ isDisable }) => (!isDisable ? ticketRed : ticketSteel)});
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 40px;
    margin: 0px 4px;
  }
`;
