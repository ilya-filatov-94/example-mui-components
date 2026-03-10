import { FC } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled as muiStyled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { drawerHeight } from '../SideBar/consts';
import UserBar from '../UserBar';


const AppBar = muiStyled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer - 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }: { open?: boolean}) => open,
      style: {
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        })
      }
    }
  ]
}));

const Header: FC = () => {
  return (
    <AppBar 
      position="relative" 
      color="secondary" 
      sx={{
        height: `${drawerHeight}px`,
        justifyContent: 'center'
      }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h3"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              fontSize: '2.6rem',
              textAlign: 'center',
              color: '#43505c'
            }}>
              Сервисы
            </Typography>
            <UserBar />
        </Toolbar>
    </AppBar>
  )
}

export default Header;
