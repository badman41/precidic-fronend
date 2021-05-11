import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import isPast from 'date-fns/isPast';
import { Box, BoxBody, BoxHeader, BoxTitle } from 'src/components/Box';
import Container from 'src/components/Container';
import Page from 'src/components/Page';
import TopBanner from './components/TopBanner';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import useDiamondHand from 'src/hooks/useDiamondHand';
import { useCurrentLotto } from 'src/contexts/CurrentLotteryProvider/CurrentLotteryProvider';
import { LotteryStatus } from 'src/diamondhand/Lottery';
import useHandleTransactionReceipt from 'src/hooks/useHandleTransactionReceipt';
import Input from 'src/components/Input';
import NumberDisplay from 'src/components/Number';
import { ConfigurationInfo } from 'src/diamondhand/types';
import { BigNumber } from 'ethers';

interface ContractLink {
  name: string;
  address: string;
}

const Monitor: React.FC = () => {
  const dh = useDiamondHand();
  const [contracts, setContracts] = useState<ContractLink[]>([]);
  const config = useConfiguration();
  const { info, prizes: currentPrizes } = useCurrentLotto();
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [roundDraw, setRoundDraw] = useState(undefined);
  const [seedDraw, setSeedDraw] = useState(undefined);
  const [data, setData] = useState<ConfigurationInfo>({} as ConfigurationInfo);
  const { deployments } = config;

  const isCompleted = useMemo(() => {
    return info?.lotteryStatus === LotteryStatus.Completed;
  }, [info?.lotteryStatus]);

  const isPastClosing = useMemo(() => {
    return isPast(info?.closingTimestamp);
  }, [info]);

  const total = useMemo(() => {
    if (!currentPrizes || currentPrizes.length == 0) return BigNumber.from(0);
    let total = currentPrizes[0];
    total = total.add(currentPrizes[1]);
    total = total.add(currentPrizes[2]);
    return total;
  }, [currentPrizes]);

  useEffect(() => {
    if (!deployments || !dh) {
      return;
    }
    dh?.getInfo().then((res) => {
      setData(res);
    });
    const _contracts: ContractLink[] = [];
    for (const [name, deployment] of Object.entries(deployments)) {
      _contracts.push({
        name,
        address: deployment.address,
      });
    }
    setContracts(_contracts);
  }, [deployments, dh]);

  const manualStart = async () => {
    const tx = await handleTransactionReceipt(
      dh.LOTTERY?.manualStartLotto(startDate, endDate),
      `Manual start lottery`,
    );
    if (tx && tx.response) {
      await tx.response.wait();
      tx.hideModal();
    }
  };

  const autoStart = async () => {
    const tx = await handleTransactionReceipt(
      dh.LOTTERY?.autoStartLotto(),
      `Auto start lottery`,
    );
    if (tx && tx.response) {
      await tx.response.wait();
      tx.hideModal();
    }
  };

  const drawWinningNumbers = async () => {
    const tx = await handleTransactionReceipt(
      dh.LOTTERY?.drawWinningNumbers(roundDraw, seedDraw),
      `Draw winning lottery`,
    );
    if (tx && tx.response) {
      await tx.response.wait().then((val) => console.log(val));
      tx.hideModal();
    }
  };

  return (
    <Page>
      <Container size="lg">
        <TopBanner />
        <StyledDoubleCol>
          <StyledCol>
            <Box>
              <BoxHeader bg="#86e3ff">
                <BoxTitle>Information</BoxTitle>
              </BoxHeader>
              <BoxBody>
                <div className="item">
                  <div className="title">Current round:</div>
                  <div className="value"> Round {info?.lotteryId}</div>
                </div>
                <div className="item">
                  <div className="title">Prize pool:</div>
                  <div className="value">
                    <NumberDisplay value={total} decimals={18} precision={0} keepZeros={true} />{' '}
                    IRON
                  </div>
                </div>
                <div className="item">
                  <div className="title">Prize reserve pool:</div>
                  <div className="value">
                    <NumberDisplay
                      value={data?.balances?.[0]}
                      decimals={18}
                      precision={0}
                      keepZeros={true}
                    />{' '}
                    IRON
                  </div>
                </div>
                <div className="item">
                  <div className="title">Burn Steel pool:</div>
                  <div className="value">
                    <NumberDisplay
                      value={data?.balances?.[1]}
                      decimals={18}
                      precision={0}
                      keepZeros={true}
                    />{' '}
                    IRON
                  </div>
                </div>
                <div className="item">
                  <div className="title">Burn Dnd pool:</div>
                  <div className="value">
                    <NumberDisplay
                      value={data?.balances?.[2]}
                      decimals={18}
                      precision={0}
                      keepZeros={true}
                    />{' '}
                    IRON
                  </div>
                </div>
                <div className="item">
                  <div className="title">Random Generator pool:</div>
                  <div className="value">
                    <NumberDisplay
                      value={data?.balances?.[3]}
                      decimals={18}
                      precision={0}
                      keepZeros={true}
                    />{' '}
                    LINK
                  </div>
                </div>
                <div className="item">
                  <div className="title">Cost per ticket:</div>
                  <div className="value">
                    <NumberDisplay
                      value={data?.costPerTicket}
                      decimals={18}
                      precision={0}
                      keepZeros={true}
                    />{' '}
                    IRON
                  </div>
                </div>
                <div>
                  <div className="title">Prize distribution:</div>
                  <div className="value">
                    <ul>
                      <li>Jackpot (aka "Match 5"): {data?.jackPotDistribution}% </li>
                      <li>Match 4: {data?.matchFourDistribution}% </li>
                      <li>Match 3: {data?.matchThreeDistribution}% </li>
                    </ul>
                  </div>
                </div>
                <div className="item">
                  <div className="title">Tax rate:</div>
                  <div className="value">{data?.taxRate}%</div>
                </div>
                <div className="item">
                  <div className="title">Reserve pool rate:</div>
                  <div className="value">{data?.reservePoolRatio}%</div>
                </div>
                <div className="item">
                  <div className="title">Burn Steel pool rate:</div>
                  <div className="value">{data?.burnSteelRatio}%</div>
                </div>
                <div className="item">
                  <div className="title">Burn Dnd pool rate:</div>
                  <div className="value">{data?.burnDndRatio}%</div>
                </div>
                <div className="item">
                  <div className="title">Powerball range:</div>
                  <div className="value">{data?.powerBallRange}</div>
                </div>
                <div className="item">
                  <div className="title">Max valid range:</div>
                  <div className="value">{data?.maxValidRange}</div>
                </div>
              </BoxBody>
            </Box>
          </StyledCol>

          <StyledCol>
            <Box>
              <BoxHeader bg="#ffbbe2">
                <BoxTitle>Contracts</BoxTitle>
              </BoxHeader>
              <BoxBody>
                {(contracts || []).map((c) => (
                  <BoxListItem key={c.name}>
                    <BoxListItemLink
                      target="_blank"
                      href={`${config.etherscanUrl}/address/${c.address}`}
                    >
                      {c.name}
                    </BoxListItemLink>
                  </BoxListItem>
                ))}
              </BoxBody>
            </Box>
          </StyledCol>
          <StyledCol>
            <Box>
              <BoxHeader bg="#86e3ff">
                <BoxTitle>Start New Lottery</BoxTitle>
              </BoxHeader>
              <BoxBody>
                <StyledButtons>
                  <StyledButton disabled={!isCompleted} isTransparent onClick={autoStart}>
                    Auto Start
                  </StyledButton>
                  <Separator />
                </StyledButtons>
                <StyledSelectDateWrapper>
                  <div className="date">
                    <Input
                      onChange={(val) => setStartDate(val)}
                      value={startDate}
                      placeholder="Enter start date"
                    />
                  </div>
                  <div className="date">
                    <Input
                      onChange={(val) => setEndDate(val)}
                      value={endDate}
                      placeholder="Enter end date"
                    />
                  </div>
                </StyledSelectDateWrapper>
                <StyledButtons>
                  <StyledButton disabled={!isCompleted} onClick={manualStart}>
                    Manual Start
                  </StyledButton>
                </StyledButtons>
              </BoxBody>
            </Box>
          </StyledCol>
          <StyledCol>
            <Box>
              <BoxHeader bg="#86e3ff">
                <BoxTitle>Draw lottery</BoxTitle>
              </BoxHeader>
              <BoxBody>
                <StyledInputs>
                  <Input
                    onChange={(val) => setRoundDraw(val)}
                    value={roundDraw}
                    placeholder="Enter round number"
                    disable={isCompleted || !isPastClosing}
                  />
                </StyledInputs>
                <StyledInputs>
                  <Input
                    onChange={(val) => setSeedDraw(val)}
                    value={seedDraw}
                    placeholder="Enter seed"
                    disable={isCompleted || !isPastClosing}
                  />
                </StyledInputs>
                <StyledButtons>
                  <StyledButton
                    disabled={isCompleted || !isPastClosing || !roundDraw || !seedDraw}
                    onClick={drawWinningNumbers}
                  >
                    Draw Winning Numbers
                  </StyledButton>
                </StyledButtons>
              </BoxBody>
            </Box>
          </StyledCol>
        </StyledDoubleCol>
      </Container>
    </Page>
  );
};

const StyledDoubleCol = styled.div`
  margin-top: 40px;
  display: grid;
  grid-gap: 20px;
  justify-items: center;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
  @media (max-width: 768px) {
    display: block;
    margin-top: 12px;
  }
`;

const StyledCol = styled.div`
  width: 100%;
  height: 100%;
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
  .item {
    display: flex;
  }
  .title {
    margin-right: 10px;
    font-weight: bold;
  }
  .value {
    ul {
      margin: 0;
    }
  }
`;

const Separator = styled.div`
  height: 1px;
  border-top: dashed 3px ${(props) => props.theme.color.primary.main};
  margin: 30px 0;
`;

export const BoxList = styled.ul`
  list-style: cirle;
  padding-left: 18px;
  margin: 0;
`;
export const BoxListItem = styled.li`
  margin-bottom: 5px;
`;
export const BoxListItemLink = styled.a`
  cursor: pointer;
  border: none;
  padding-left: 0px;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
  &:hover {
    text-decoration: underline;
  }
`;

export const BoxItem = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
`;

const StyledButtons = styled.div`
  align-items: center;
  padding: 0 15px 10px;
`;

const StyledInputs = styled.div`
  align-items: center;
  padding: 0 15px 10px;
  margin-top: 20px;
`;

const StyledButton = styled.button<{
  isTransparent?: boolean;
  disabled?: boolean;
  normal?: boolean;
}>`
  font-size: 16px;
  appearance: none;
  font-family: ${(p) => p.theme.font.heading};
  color: ${({ theme }) => theme.color.primary.main};
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
  &:hover {
    background-color: ${(p) => p.theme.color.bg};
  }
  margin: ${({ normal }) => (normal ? '30px auto' : '20px 0')};
  width: ${({ normal }) => (normal ? 'auto' : '100%')};
  background-color: ${({ disabled, theme, isTransparent }) =>
    disabled ? theme.color.grey[400] : isTransparent ? 'transparent' : theme.color.green[100]};
`;

const StyledSelectDateWrapper = styled.div`
  padding: 0 15px 10px;
  .date {
    &:first-child {
      margin-bottom: 20px;
    }
    flex: 1;
  }
`;

export default Monitor;
