import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled as muiStyled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Backdrop, Collapse } from '@mui/material';
import { AppTheme } from '../../App';
import pages, { TPage } from '../app/pages';
import ServiceIcon from '../../assets/images/serviceIcon.png'; // вместо LogoIcon
import { drawerHeight, drawerWidth } from './consts';

const openedMixin = (theme: AppTheme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: AppTheme) => ({
    transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  }
});

const DrawerHeader = muiStyled('div')(({ theme }) => ({
  minHeight: drawerHeight,
  height: drawerHeight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = muiStyled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open'})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }
    }
  ]
}));

const createExpandIcon = (page: TPage, currentOpenedItem: string | null) => {
  if (page?.content) {
    return currentOpenedItem === page.label
      ? <ExpandLess sx={{ mr: 1 }} />   // отступ справа от текста
      : <ExpandMore sx={{ mr: 1 }} />;
  }
  return null; // вместо пустого фрагмента
};

const SideBar: FC = () => {
  const [isOpenSideBar, openSideBar] = useState(false);
  const [currentOpenedItem, setCurrentOpenedItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const userRole = 'USER';

  useEffect(() => {
    if (!isOpenSideBar) {
      setCurrentOpenedItem(null);
    }
  }, [isOpenSideBar]);

  const handleSideBarOpen = () => {
    openSideBar(true);
  }
  
  const handleSideBarClose = () => {
    openSideBar(false);
  }
  
  const toggleSideBar = () => {
    openSideBar(prev => !prev);
  }

  const changeOpenedItem = (newItem: string) => {
    setCurrentOpenedItem(newItem)
  }

  const handleNavigate = (to: string) => {
    navigate(to);
    handleSideBarClose();
  }

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isOpenSideBar}
        onClick={handleSideBarClose}
      />
      <Drawer variant="permanent" open={isOpenSideBar} sx={{ zIndex: 7050 }}>
        <DrawerHeader>
          <IconButton onClick={toggleSideBar}>
            <Icon
              sx={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                backgroundSize: 'contain',
                content: `url(${ServiceIcon})`,
              }}
            />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box sx={{ width: `${drawerWidth}px`}} role="presentation">
          <List>
              {pages.map((page) => (
                page.roles.includes(userRole) && (
                  <ListItem key={page.label} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      onClick={() => {
                        handleSideBarOpen();
                        changeOpenedItem(page.label);
                      }}
                      sx={{
                        justifyContent: isOpenSideBar ? 'initial' : 'center',
                        minHeight: 48, px: 2.5,
                      }}
                    >
                      {isOpenSideBar && createExpandIcon(page, currentOpenedItem)}
                      <ListItemIcon sx={{ 
                          mr: isOpenSideBar ? 3 : 'auto',
                          minWidth: 0,
                          justifyContent: 'center',
                        }}>
                        {page.icon}
                      </ListItemIcon>
                      <ListItemText primary={page.label} sx={{ opacity: isOpenSideBar ? 1 : 0 }} />
                    </ListItemButton>
                    {page?.content && (
                      <Collapse in={currentOpenedItem === page.label} timeout="auto" unmountOnExit>
                        <List component='div' disablePadding>
                          {page?.content?.map((subPage) => (
                            subPage.roles.includes(userRole) && (
                              <ListItemButton
                                key={subPage.label}
                                sx={{ pl: 5 }}
                                onClick={() => handleNavigate(subPage.to)}
                              >
                                {subPage.label}
                              </ListItemButton>
                            )
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </ListItem>
                )
              )
              )}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default SideBar;
