import { FC } from 'react';
import { useSelector } from 'src/store/Store';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoDark } from 'src/assets/images/logos/logo.svg';
import { ReactComponent as LogoLight } from 'src/assets/images/logos/light-logo.svg';
import { styled } from '@mui/material';
import { AppState } from 'src/store/Store';

const height = 60;
const Logo: FC = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    width: customizer.isCollapse ? '40px' : '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  }));

  return (
    <LinkStyled to="/">
      {customizer.activeMode === 'dark' ? (
        <LogoLight width={height * 2.3} height={height} preserveAspectRatio="none" />
      ) : (
        <LogoDark width={height * 2.3} height={height} preserveAspectRatio="none" />
      )}
    </LinkStyled>
  );

};

export default Logo;
