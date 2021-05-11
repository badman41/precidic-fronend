import React, { useCallback, useMemo } from 'react';
import crypto from 'crypto';
import { TicketItemProp } from 'src/api/models';
import styled from 'styled-components';
import theme from 'src/theme';
import ImgBallSelected from 'src/assets/img/ball-selected.svg';
import ImgBallNoSelected from 'src/assets/img/ball-no-selected.svg';
import ImgBallPower from 'src/assets/img/ball-power.svg';
import ImgRandom from 'src/assets/img/ic-dice.png';
import IconRemove from 'src/assets/img/remove.svg';
import { range } from 'src/utils/objects';

const maxChooseNumber = 4;

const slots = range(0, 4);

interface TicketItemProps {
  index: number;
  max: number;
  powerBallMax: number;
  ticketItem: TicketItemProp;
  onChange?: (index: number, data: TicketItemProp) => void;
  removeTicket: (index: number) => void;
}

const ranHex = (length: number) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

const rand = (n: number, max: number, maxPowerBall: number) => {
  const hex = ranHex(64);
  let array: number[] = [];

  for (let index = 0; index < max; index++) {
    array[index] = index + 1;
  }

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  array = array.slice(0, n);
  array.push((parseInt('0x' + hex.substr(n + 1, 8)) % maxPowerBall) + 1);

  return array;
};

const SelectTicketItem: React.FC<TicketItemProps> = ({
  index,
  max,
  powerBallMax,
  ticketItem,
  onChange,
  removeTicket,
}) => {
  const normalNumberArray = useMemo(() => range(1, 1 + max), [max]);
  const powerNumberArray = useMemo(() => range(1, 1 + powerBallMax), [powerBallMax]);

  const onSelect = useCallback(
    (number: number) => {
      let selected = ticketItem.selectedNumbers;
      if (selected.includes(number)) {
        selected = selected.filter((x) => x !== number);
      } else if (selected.length < maxChooseNumber) {
        selected = [...selected, number];
      }

      onChange(index, {
        ...ticketItem,
        selectedNumbers: selected,
      });
    },
    [index, onChange, ticketItem],
  );

  const selectPowerNumber = useCallback(
    (n) => {
      if (ticketItem.selectedPowerNumber === n) {
        return;
      }
      onChange(index, {
        ...ticketItem,
        selectedPowerNumber: ticketItem.selectedPowerNumber === n ? undefined : n,
      });
    },
    [index, onChange, ticketItem],
  );

  const randomTicket = useCallback(() => {
    const randomData = rand(4, max, powerBallMax);

    onChange(index, {
      ...ticketItem,
      selectedNumbers: randomData.slice(0, 4),
      selectedPowerNumber: randomData[4],
    });
  }, [index, max, onChange, powerBallMax, ticketItem]);

  const isValid = useMemo(() => {
    return (
      ticketItem && ticketItem.selectedNumbers.length > 3 && ticketItem.selectedPowerNumber > 0
    );
  }, [ticketItem]);

  const handleRemove = useCallback(() => {
    removeTicket(index);
  }, [index, removeTicket]);

  return (
    <ContainerItem>
      <HeaderStyled active={isValid}>
        <TicketNumberStyled>TICKET {index + 1}</TicketNumberStyled>
        <RandomButtonStyled onClick={randomTicket}>
          <RandomImageStyled></RandomImageStyled>
        </RandomButtonStyled>
        <IconRemoveStyled className="fal fa-minus-circle" onClick={handleRemove}>
          <img src={IconRemove} draggable="false" />
        </IconRemoveStyled>
      </HeaderStyled>
      <SelectedBallContainerStyled>
        {slots.map((i) => {
          return (
            <BallStyled key={i} selected={!!ticketItem.selectedNumbers[i]}>
              {ticketItem.selectedNumbers[i] || '?'}
            </BallStyled>
          );
        })}
        <BallStyled selected={ticketItem.selectedPowerNumber > 0} isPower={true}>
          {ticketItem.selectedPowerNumber ? ticketItem.selectedPowerNumber : '?'}
        </BallStyled>
      </SelectedBallContainerStyled>
      <NormalBallContainerStyted>
        <SelectBumberLabelStyled>Choose 4 numbers</SelectBumberLabelStyled>
        <NumberChoosenStyled>
          {normalNumberArray?.map((key: number) => (
            <Ball
              key={key}
              number={key}
              selected={ticketItem.selectedNumbers.includes(key)}
              disabled={
                !ticketItem.selectedNumbers.includes(key) &&
                ticketItem.selectedNumbers.length === maxChooseNumber
              }
              onSelect={onSelect}
            />
          ))}
        </NumberChoosenStyled>
      </NormalBallContainerStyted>
      <NormalBallContainerStyted className="power">
        <SelectBumberLabelStyled>Choose 1 number</SelectBumberLabelStyled>
        <NumberChoosenStyled>
          {powerNumberArray?.map((n) => (
            <Ball
              key={n}
              number={n}
              disabled={ticketItem.selectedPowerNumber === n}
              selected={ticketItem.selectedPowerNumber === n}
              onSelect={selectPowerNumber}
              className="power"
            />
          ))}
        </NumberChoosenStyled>
      </NormalBallContainerStyted>
    </ContainerItem>
  );
};

const Ball = ({
  number,
  selected,
  disabled,
  onSelect,
  className,
}: {
  number: number;
  selected: boolean;
  disabled: boolean;
  onSelect: (x: number) => void;
  className?: string;
}) => {
  const handleClick = useCallback(() => {
    onSelect(number);
  }, [onSelect, number]);
  return (
    <ButtonStyled>
      <ButtonNumberStyled
        className={className}
        selected={selected}
        isDisable={disabled}
        onClick={handleClick}
      >
        {number}
      </ButtonNumberStyled>
    </ButtonStyled>
  );
};

const ContainerItem = styled.div`
  border: solid 2px ${theme.color.primary.main};
  background-color: ${theme.color.white};
  position: relative;
`;
const HeaderStyled = styled.div<{ active?: boolean }>`
  display: flex;
  padding: 8px 12px;
  border-bottom: solid 2px ${theme.color.primary.main};
  align-items: center;
  background-color: ${({ active }) => (active ? theme.color.blue[400] : theme.color.yellow)};
  color: ${theme.color.black};
`;
const TicketNumberStyled = styled.h3`
  font-weight: bold;
  font-size: 1rem;
  flex: 1;
  margin: 0;
  color: ${theme.color.primary.main};
`;
const SelectedBallContainerStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  margin: 0 18px;
  align-items: center;
  border-bottom: dashed 1px ${theme.color.grey[300]};
`;

const IconRemoveStyled = styled.div`
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-left: 10px;
`;
const RandomButtonStyled = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 5px;
`;
const RandomImageStyled = styled.div`
  width: 20px;
  height: 20px;
  background-repeat: none;
  background-size: cover;
  background-image: url(${ImgRandom});
`;
const BallStyled = styled.div<{ selected?: boolean; isPower?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: ${({ selected }) => (selected ? theme.color.black : theme.color.primary.main)};
  background-image: ${({ selected, isPower }) =>
    `url(` + (selected ? (isPower ? ImgBallPower : ImgBallSelected) : ImgBallNoSelected) + `)`};

  @media (max-width: 768px) {
    width: 37px;
    height: 37px;
    background-repeat: no-repeat;
    background-size: contain;
  }
`;

const NormalBallContainerStyted = styled.div`
  padding: 15px 18px;
  border-bottom: dashed 1px ${theme.color.grey[500]};
  &.power {
    background-color: ${theme.color.blue[50]};
    border-bottom: none;
  }
`;

const ButtonNumberStyled = styled.div<{ isDisable?: boolean; selected?: boolean }>`
  width: 100%;
  height: 100%;
  font-size: 14px;
  align-items: center;
  display: flex;
  justify-content: center;
  border: solid 1px ${(p) => (p.selected ? p.theme.color.primary.main : '#d5d5d5')};
  cursor: ${({ isDisable }) => (!isDisable ? 'pointer' : 'unset')};
  font-weight: ${(p) => (p.selected ? 700 : 400)};
  background-color: ${(p) => (p.selected ? p.theme.color.orange[300] : '')};

  &:hover {
    ${({ isDisable }) =>
      !isDisable &&
      `
        background-color: ${theme.color.orange[300]};
        font-weight: 700;
        border: solid 1px ${theme.color.primary.main};
      `}
  }

  &.power {
    &:hover {
      ${({ isDisable }) =>
        !isDisable &&
        `
          background-color: ${theme.color.orange[500]};
        `}
    }
    background-color: ${(p) => (p.selected ? p.theme.color.orange[500] : '')} !important;
  }
`;
const ButtonStyled = styled.div`
  width: 28px;
  height: 28px;
  margin-right: 6px;
  margin-bottom: 6px;
  text-align: center;
  display: inline-block;
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const NumberChoosenStyled = styled.div`
  margin-right: -6px;
`;

const SelectBumberLabelStyled = styled.div`
  font-weight: 600;
  margin-bottom: 9px;
  font-size: 14px;
`;
export default SelectTicketItem;
