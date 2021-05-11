import React, { useCallback, useMemo, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/pro-solid-svg-icons';
import { faCoins } from '@fortawesome/pro-solid-svg-icons';
import styled from 'styled-components';
import { TicketItemProp } from 'src/api/models';
import Container from 'src/components/Container';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import useApprove, { ApprovalState } from 'src/hooks/useApprove';
import useDiamondHand from 'src/hooks/useDiamondHand';
import useTryConnect from 'src/hooks/useTryConnect';
import theme from 'src/theme';
import SelectTicketItem from './SelectTicketItem';
import TicketImg from 'src/assets/img/ticket.svg';
import Page from 'src/components/Page';
import { flatten } from 'src/utils/objects';
import useHandleTransactionReceipt from 'src/hooks/useHandleTransactionReceipt';
import NumberDisplay from 'src/components/Number';
import { ExternalLinks } from 'src/config';
import { useTokenBalance } from 'src/contexts/AccountBalanceProvider/AccountBalanceProvider';
import { useCurrentLotto } from 'src/contexts/CurrentLotteryProvider/CurrentLotteryProvider';
import { useHistory } from 'react-router';

enum ButtonStatus {
  notConnected = 1,
  insufficient = 2,
  requireApproval = 3,
  approvalPending = 4,
  paused = 15,
  ready = 20,
  notEnoughIron = 21,
}

const EmptyTicket: TicketItemProp = {
  selectedNumbers: [],
  selectedPowerNumber: undefined,
};

const BuyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<TicketItemProp[]>([EmptyTicket]);
  const diamondHand = useDiamondHand();
  const { info, maxValidRange, powerBallRange } = useCurrentLotto();
  const { tryConnect } = useTryConnect();
  const config = useConfiguration();
  const [approvalIronState, approveIron] = useApprove(
    diamondHand?.IRON,
    config?.addresses?.Lottery,
  );
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const balance = useTokenBalance(diamondHand?.IRON);
  const history = useHistory();

  const addNewTicket = useCallback(() => {
    setTickets((x) => {
      const newBall = { ...EmptyTicket };

      return [...x, newBall];
    });
  }, []);

  const onChangeTicket = useCallback((index: number, ticket: TicketItemProp) => {
    setTickets((state) => {
      return state.map((item, idx) => {
        if (idx !== index) {
          return item;
        }

        return {
          ...item,
          ...ticket,
        };
      });
    });
  }, []);

  const removeTicket = useCallback((id: number) => {
    setTickets((tickets) => tickets.slice(0, id).concat(tickets.slice(id + 1)));
  }, []);

  const validTickets = useMemo(() => {
    return tickets.filter((t) => t.selectedNumbers.length === 4 && t.selectedPowerNumber);
  }, [tickets]);

  const totalCost = useMemo(() => {
    if (!info?.costPerTicket) {
      return BigNumber.from(0);
    }
    return info.costPerTicket.mul(validTickets?.length || 0);
  }, [info?.costPerTicket, validTickets?.length]);

  const status = useMemo(() => {
    if (diamondHand && !diamondHand.isUnlocked) {
      return ButtonStatus.notConnected;
    }

    if (approvalIronState !== ApprovalState.APPROVED) {
      return ButtonStatus.requireApproval;
    }

    if (balance && balance.lt(totalCost)) {
      return ButtonStatus.notEnoughIron;
    }

    return ButtonStatus.ready;
  }, [approvalIronState, diamondHand, totalCost, balance]);

  const buy = useCallback(async () => {
    const validTickets = tickets.filter(
      (t) => t.selectedNumbers.length === 4 && t.selectedPowerNumber,
    ); // TODO: real check
    const numbers = flatten(
      validTickets.map((t) => [...t.selectedNumbers, t.selectedPowerNumber]),
    );

    if (!validTickets.length) {
      return;
    }

    const tx = await handleTransactionReceipt(
      diamondHand?.LOTTERY.batchBuyLottoTicket(info?.lotteryId, validTickets?.length, numbers),
      `Buy ${validTickets.length} Dragon Ball tickets`,
    );

    if (tx && tx.response) {
      await tx.response.wait();
      tx.hideModal();
      history.push(`/ticket?lotteryId=${info?.lotteryId}`);
    }
  }, [diamondHand?.LOTTERY, handleTransactionReceipt, history, info?.lotteryId, tickets]);

  const onClickBuy = useCallback(async () => {
    switch (status) {
      case ButtonStatus.notConnected:
        tryConnect();
        break;
      case ButtonStatus.requireApproval:
        await approveIron();
        break;
      case ButtonStatus.notEnoughIron:
        break;
      case ButtonStatus.ready:
        buy();
        break;
    }
  }, [approveIron, buy, tryConnect, status]);

  const buttonText = useMemo(() => {
    switch (status) {
      case ButtonStatus.notConnected:
        return 'Connect';

      case ButtonStatus.requireApproval:
        return 'Approve';

      case ButtonStatus.notEnoughIron:
        return 'Not Enough Iron';

      default:
        return 'Buy tickets';
    }
  }, [status]);

  return (
    <Page home>
      <Container size="homepage">
        <HeaderStyled>
          <BuyTicketHeaderStyled>
            <BuyTicketImagetyled>
              <img src={TicketImg} />
            </BuyTicketImagetyled>
            <BuyTicketLabeltyled>BUY TICKETS</BuyTicketLabeltyled>
          </BuyTicketHeaderStyled>
          <StyledHeaderRight>
            <StyledBalance>
              <span>Your balance: </span>
              <BignumberStyled>
                <NumberDisplay value={balance} decimals={18} precision={2} />
              </BignumberStyled>
              <span className="unit">IRON</span>
            </StyledBalance>
            <StyledBuyIRon>
              <StyledLink target="_blank" href={ExternalLinks.buyIron}>
                <StyledFontAwesomeIcon
                  icon={faShoppingCart}
                  style={{ color: theme.color.primary.main }}
                />
                Buy IRON
              </StyledLink>
              <StyledLink target="_blank" href={ExternalLinks.mintIron}>
                <StyledFontAwesomeIcon
                  icon={faCoins}
                  style={{ color: theme.color.primary.main }}
                />
                Mint IRON
              </StyledLink>
            </StyledBuyIRon>
          </StyledHeaderRight>
        </HeaderStyled>
        <NumberTicketHeaderStyled>
          <ChooseNumberTicketStyled>
            <ChooseNumberTicketLabelStyled>Number of tickets:</ChooseNumberTicketLabelStyled>
            <ChooseNumberTicketInputStyled>{tickets.length}</ChooseNumberTicketInputStyled>
            <ChooseNumberTicketGroupStyled onClick={addNewTicket}>
              +
            </ChooseNumberTicketGroupStyled>
            <div>
              <BignumberStyled>1</BignumberStyled>
              <span>Ticket = </span>
              <BignumberStyled>
                <NumberDisplay
                  value={info?.costPerTicket}
                  decimals={18}
                  precision={0}
                  keepZeros={true}
                />
              </BignumberStyled>
              <span>IRON</span>
            </div>
          </ChooseNumberTicketStyled>
          <ApproveContainerStyled>
            <div>
              <SpendLabelStyled>You will spend:</SpendLabelStyled>
              <AmountStyled>
                <NumberDisplay value={totalCost} decimals={18} precision={0} keepZeros={true} />{' '}
                IRON
              </AmountStyled>
            </div>
            <ApproveButtonStyled
              type="button"
              className={status == ButtonStatus.notEnoughIron ? 'btn not-enough' : 'btn'}
              onClick={onClickBuy}
            >
              {buttonText}
            </ApproveButtonStyled>
          </ApproveContainerStyled>
        </NumberTicketHeaderStyled>
        <TicketContainerStyled>
          {tickets.map((ticket, index) => {
            return (
              <SelectTicketItemContainerStyled key={index}>
                <SelectTicketItem
                  index={index}
                  max={maxValidRange}
                  powerBallMax={powerBallRange}
                  ticketItem={ticket}
                  onChange={onChangeTicket}
                  removeTicket={removeTicket}
                ></SelectTicketItem>
              </SelectTicketItemContainerStyled>
            );
          })}
          <AddNewTicketButtonStyled onClick={addNewTicket}>
            <AddNewTicketButtonHeader>Add new ticket</AddNewTicketButtonHeader>+
          </AddNewTicketButtonStyled>
        </TicketContainerStyled>
      </Container>
    </Page>
  );
};

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  color: ${theme.color.primary.main};
  border-bottom: dashed 2px ${theme.color.primary.main};
  padding-bottom: 13px;
  @media (max-width: 768px) {
    display: block;
    border-bottom: none;
    padding-bottom: 0px;
  }
`;
const BuyTicketHeaderStyled = styled.div`
  display: flex;
  align-items: flex-end;
  @media (max-width: 768px) {
    border-bottom: dashed 2px ${theme.color.primary.main};
    padding-bottom: 20px;
  }
`;
const NumberTicketHeaderStyled = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 21px 0;
  @media (max-width: 768px) {
    padding: 15px 0 10px 0;
  }
`;
const ChooseNumberTicketStyled = styled.div`
  display: flex;
  align-items: center;
`;
const ChooseNumberTicketLabelStyled = styled.span`
  margin-right: 12px;
  color: ${theme.color.primary.main};
  font-weight: 600;
`;
const ChooseNumberTicketInputStyled = styled.span`
  height: 46px;
  width: 62px;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.color.primary.main};
  background-color: ${theme.color.white};
`;
const ChooseNumberTicketGroupStyled = styled.span`
  height: 46px;
  width: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 1px solid ${theme.color.primary.main};
  border-left: none;
  background-color: ${theme.color.orange[500]};
  padding-bottom: 4px;
  cursor: pointer;
  margin-right: 10px;
`;
const BuyTicketImagetyled = styled.div`
  height: 40px;
  img {
    height: 100%;
  }
`;
const ApproveContainerStyled = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: #fcc676;
    padding: 10px 0 20px 0;
    button {
      margin-top: 5px;
    }
  }
`;
const SpendLabelStyled = styled.span`
  margin-right: 9px;
`;
const AmountStyled = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`;

const ApproveButtonStyled = styled.button`
  margin-left: 10px;
  background-color: ${theme.color.green[100]};
  &.not-enough {
    background-color: #ff9e9e;
  }
`;
const BuyTicketLabeltyled = styled.h1`
  color: ${theme.color.primary.main};
  margin: 0;
  margin-left: 12px;
  font-weight: bold;
`;
const BignumberStyled = styled.span`
  font-size: 1.1rem;
  margin: 0 4px;
  font-weight: bold;
`;
const TicketContainerStyled = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 768px) {
    display: block;
    margin-top: 12px;
  }
`;
const SelectTicketItemContainerStyled = styled.div`
  width: 100%;
  @media (max-width: 768px) {
    margin-bottom: 14px;
  }
`;
const AddNewTicketButtonStyled = styled.div`
  width: 100%;
  border: dashed 3px ${theme.color.primary.main};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  font-weight: 400;
  cursor: pointer;
  background-color: rgba(246, 153, 99, 0.29);
  position: relative;
  &:hover {
    border-color: ${theme.color.green[600]};
    color: ${theme.color.green[600]};
  }
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;
const AddNewTicketButtonHeader = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 42px;
  line-height: 1;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  padding: 5px 10px;
  font-family: ${theme.font.heading};
  background-color: rgba(246, 153, 99, 0.6);
`;
const StyledHeaderRight = styled.div`
  display: flex;
  @media (max-width: 768px) {
    display: block;
    text-align: center;
    margin-top: 12px;
  }
`;

const StyledBalance = styled.div`
  color: ${theme.color.green[600]};
  font-size: 1.125rem;
  font-weight: 500;
  margin-right: 5px;
  .unit {
    font-weight: 700;
  }
`;
const StyledBuyIRon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-right: 5px;
`;
const StyledLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  justify-content: center;
  padding: 0px;
  margin-left: 15px;
  font-weight: 700;
  font-size: 14px;
  &:hover {
    color: ${(p) => p.theme.color.orange[500]};
  }
`;

export default BuyTickets;
