import { useMemo } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import bgLottery from './assets/img/bg.svg';
import logoIron from 'src/assets/img/logo-iron-team.png';

const MainWrapper: React.FC = ({ children }) => {
  const location = useLocation();

  const bg = useMemo(() => {
    if (!location) {
      return bgLottery;
    }
    return bgLottery;
  }, [location]);

  return (
    <StyledMainContent bg={bg}>
      <StyledMain>{children}</StyledMain>
      <Credit>
        <StyledAuthorView href="https://iron.finance" target="_blank">
          Developed by &nbsp;
          <img src={logoIron} width={53} />
          &nbsp;team
        </StyledAuthorView>
      </Credit>
    </StyledMainContent>
  );
};

const StyledMainContent = styled.div<{ bg: string }>`
  min-height: 100vh;
  background-image: url(${(props) => props.bg});
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 0;
  }
`;

const StyledMain = styled.div`
  flex: 1;
`;

const StyledAuthorView = styled.a`
  padding: 0;
  display: flex;
  font-size: 14px;
  color: ${({ theme }) => theme.color.primary.main};
  justify-content: center;
  text-decoration: none;
  align-items: center;
`;

const Credit = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;
export default MainWrapper;
