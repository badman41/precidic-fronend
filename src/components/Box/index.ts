import styled from 'styled-components';

export const Box = styled.div`
  background-color: ${(props) => props.theme.color.white};
  border: solid 3px ${(props) => props.theme.color.primary.main};
  height: 100%;
`;

export const BoxHeader = styled.div<{ bg?: string }>`
  border-bottom: solid 3px ${(props) => props.theme.color.primary.main};
  padding: 8px 15px;
  background-color: ${({ bg, theme }) => bg || theme.color.white};
  display: flex;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const BoxTitle = styled.div`
  font-family: ${({ theme }) => theme.font.heading};
  font-size: 14px;
`;

export const BoxAction = styled.div`
  margin-left: auto;
`;

export const BoxBody = styled.div`
  padding: 8px 15px;
`;
