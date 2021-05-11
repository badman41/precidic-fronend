import React, { useMemo } from 'react';
import styled from 'styled-components';
import NextDrawCountdown from './NextDrawCountdown';
import ImgBannerLeft from 'src/assets/img/banner-left.svg';
import ImgBannerRight from 'src/assets/img/banner-right.png';
import ImgBannerLeft2 from 'src/assets/img/banner-left-2.svg';
import ImgBannerRight2 from 'src/assets/img/banner-right-2.png';
import isPast from 'date-fns/isPast';

interface TopBannerProps {
  notReady: boolean;
  lotteryId: number;
  startingTimestamp: Date;
  closingTimestamp: Date;
}

const TopBanner: React.FC<TopBannerProps> = ({
  notReady,
  lotteryId,
  startingTimestamp,
  closingTimestamp,
}) => {
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
    <TopCountdownBanner small={notReady} className={notReady ? 'small' : ''}>
      <TopCountdownLeft className="left">
        {notReady ? (
          <img className="smaller" src={ImgBannerLeft2} />
        ) : (
          <img src={ImgBannerLeft} />
        )}
      </TopCountdownLeft>
      <TopCountdownContent className="content">
        {notReady ? (
          <h2>The next round is not ready</h2>
        ) : notStarted ? (
          <h2>Round {lotteryId?.toString()} has not yet started</h2>
        ) : (
          <>
            <h4>Next draw - Round {lotteryId?.toString()}</h4>
            {isPastClosing ? (
              <DrawingContainer>Awaiting for results...</DrawingContainer>
            ) : (
              <NextDrawCountdown to={closingTimestamp} />
            )}
          </>
        )}
      </TopCountdownContent>
      <TopCountdownRight className="right">
        {notReady ? (
          <img className="smaller" src={ImgBannerRight2} />
        ) : (
          <img src={ImgBannerRight} />
        )}
      </TopCountdownRight>
    </TopCountdownBanner>
  );
};

const TopCountdownBanner = styled.div<{ small?: boolean }>`
  position: relative;
  background-color: ${({ small }) => (small ? '#86e3ff' : '#f69963')};
  border: solid 3px #400003;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  height: ${({ small }) => (small ? '80px' : '100px')};
  @media (max-width: 768px) {
    height: 85px;
  }
  &.small {
    .left {
      left: 15px !important;
      bottom: -10px;
      img {
        width: 60px;
      }
    }
    .right {
      right: 15px !important;
      bottom: -0;
      img {
        width: 65px;
      }
    }
  }
`;
const TopCountdownContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h4 {
    margin: 0;
  }
  h2 {
    margin: 0;
    font-size: 22px;
  }
  @media (max-width: 768px) {
    padding-left: 40px;
    padding-right: 10px;
    text-align: center;
    h4 {
      font-size: 14px;
    }
  }
`;
const TopCountdownLeft = styled.div`
  position: absolute;
  left: -15px;
  @media (max-width: 768px) {
    left: 5px;
    bottom: 0px;
    img {
      width: 60px;
    }
  }
`;
const TopCountdownRight = styled.div`
  position: absolute;
  right: -15px;
  @media (max-width: 768px) {
    img {
      display: none;
    }
  }
`;

const DrawingContainer = styled.h2`
  color: ${(props) => props.theme.color.green[600]} !important;
  font-weight: 700;
`;

export default TopBanner;
