import React, { useMemo } from 'react';
import styled from 'styled-components';
import ImgBannerLeft from 'src/assets/img/banner-left.svg';
import ImgBannerRight from 'src/assets/img/banner-right.png';

const TopBanner: React.FC = () => {
  return (
    <TopCountdownBanner>
      <TopCountdownLeft className="left">
        <img src={ImgBannerLeft} />
      </TopCountdownLeft>
      <TopCountdownContent className="content">
        <h2>Monitor</h2>
      </TopCountdownContent>
      <TopCountdownRight className="right">
        <img src={ImgBannerRight} />
      </TopCountdownRight>
    </TopCountdownBanner>
  );
};

const TopCountdownBanner = styled.div`
  position: relative;
  background-color: #f69963;
  border: solid 3px #400003;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  height: 100px;
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

export default TopBanner;
