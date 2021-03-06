import React, { useContext } from 'react';
import { AlertCircle, CheckCircle } from 'react-feather';
import styled, { ThemeContext } from 'styled-components';
import { AutoColumn } from '../Column';
import { AutoRow } from '../Row';
import { useConfiguration } from '../../contexts/ConfigProvider/ConfigProvider';
import { useWeb3React } from '@web3-react/core';

interface TractionPopupProps {
  hash: string;
  success?: boolean;
  summary?: string;
}

const TransactionPopup: React.FC<TractionPopupProps> = ({ hash, success, summary }) => {
  const { chainId } = useWeb3React();
  const theme = useContext(ThemeContext);
  const config = useConfiguration();

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? (
          <CheckCircle color={theme.color.success} size={24} />
        ) : (
          <AlertCircle color={theme.color.danger} size={24} />
        )}
      </div>
      <AutoColumn gap="8px">
        <StyledPopupDesc>
          {summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}
        </StyledPopupDesc>
        {chainId && (
          <StyledLink target="_blank" href={`${config.etherscanUrl}/tx/${hash}`}>
            View on Bscscan
          </StyledLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  );
};

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`;

const StyledPopupDesc = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.color.primary.main};
`;

const StyledLink = styled.a`
  font-size: 14px;
  color: ${(props) => props.theme.color.grey[750]};
`;

export default TransactionPopup;
