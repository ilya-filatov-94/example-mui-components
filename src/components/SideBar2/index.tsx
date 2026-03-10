import { FC, useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled as muiStyled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Backdrop, Collapse } from '@mui/material';
import pages, { TPage } from '../app/pages';
import ServiceIcon from '../../assets/images/serviceIcon.png';
import { drawerHeight, drawerWidth as defaultDrawerWidth } from './consts';

const MIN_DRAWER_WIDTH = 300;
const MAX_DRAWER_WIDTH = 500;
const STORAGE_KEY = 'sidebarWidth';

const Drawer = muiStyled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  width: open ? 'var(--drawer-width, 240px)' : `calc(${theme.spacing(7)} + 1px)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: 'var(--transition-duration, 225ms)',
  }),
  overflowX: 'hidden',
  [theme.breakpoints.up('sm')]: {
    width: open ? 'var(--drawer-width, 240px)' : `calc(${theme.spacing(8)} + 1px)`,
  },
  '& .MuiDrawer-paper': {
    width: open ? 'var(--drawer-width, 240px)' : `calc(${theme.spacing(7)} + 1px)`,
    transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: 'var(--transition-duration, 225ms)',
  }),
    overflowX: 'hidden',
    [theme.breakpoints.up('sm')]: {
      width: open ? 'var(--drawer-width, 240px)' : `calc(${theme.spacing(8)} + 1px)`,
    },
  },
}));

const DrawerHeader = muiStyled('div')(({ theme }) => ({
  minHeight: drawerHeight,
  height: drawerHeight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const createExpandIcon = (page: TPage, currentOpenedItem: string | null) => {
  if (page?.content) {
    return currentOpenedItem === page.label ? (
      <ExpandLess sx={{ mr: 1 }} />
    ) : (
      <ExpandMore sx={{ mr: 1 }} />
    );
  }
  return null;
};

interface SideBarProps {
  initialWidth?: number;
}

const SideBar2: FC<SideBarProps> = ({ initialWidth }) => {
  const [isOpenSideBar, openSideBar] = useState(false);
  const [currentOpenedItem, setCurrentOpenedItem] = useState<string | null>(null);
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = Number(saved);
      if (!isNaN(parsed) && parsed >= MIN_DRAWER_WIDTH && parsed <= MAX_DRAWER_WIDTH) {
        return parsed;
      }
    }
    return initialWidth ?? defaultDrawerWidth;
  });

  const navigate = useNavigate();
  const userRole = 'USER';

  const isResizing = useRef(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Сохраняем ширину при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(width));
  }, [width]);

  // Устанавливаем CSS-переменную при монтировании и изменении ширины
  useEffect(() => {
    if (drawerRef.current) {
      drawerRef.current.style.setProperty('--drawer-width', width + 'px');
    }
  }, [width]);

  useEffect(() => {
    if (!isOpenSideBar) {
      setCurrentOpenedItem(null);
    }
  }, [isOpenSideBar]);

  const handleMouseDown = () => {
    isResizing.current = true;
    document.body.style.userSelect = 'none';
    document.documentElement.style.setProperty('--transition-duration', '0s');
  };

  const handleMouseMove = (e: MouseEvent) => {
    requestAnimationFrame(() => {
    if (!isResizing.current || !isOpenSideBar || !drawerRef.current) return;

    const rect = drawerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - rect.left;

    if (newWidth >= MIN_DRAWER_WIDTH && newWidth <= MAX_DRAWER_WIDTH) {
      drawerRef.current.style.setProperty('--drawer-width', newWidth + 'px');
    }
    })

  };

  const handleMouseUp = () => {
    if (!isResizing.current) return;
    isResizing.current = false;
    document.body.style.userSelect = '';
    document.documentElement.style.removeProperty('--transition-duration');
    if (drawerRef.current) {
      // Синхронизируем состояние с финальной шириной из CSS
      const currentWidth = parseFloat(
        getComputedStyle(drawerRef.current).getPropertyValue('--drawer-width').trim() || String(width)
      );
      if (!isNaN(currentWidth) && currentWidth >= MIN_DRAWER_WIDTH && currentWidth <= MAX_DRAWER_WIDTH) {
        setWidth(currentWidth);
      } else {
        // Если значение некорректное, восстанавливаем последнюю корректную ширину
        drawerRef.current.style.setProperty('--drawer-width', width + 'px');
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOpenSideBar, width]);

  const handleSideBarOpen = () => openSideBar(true);
  const handleSideBarClose = () => openSideBar(false);
  const toggleSideBar = () => openSideBar(prev => !prev);
  const changeOpenedItem = (newItem: string) => setCurrentOpenedItem(newItem);
  const handleNavigate = (to: string) => {
    navigate(to);
    handleSideBarClose();
  };

  const sxIconListItem = useMemo(() => ({
    mr: isOpenSideBar ? 3 : 'auto',
    minWidth: 0,
    justifyContent: 'center',
  }), [isOpenSideBar]);

  const sxListItemButton = useMemo(() => ({
    justifyContent: isOpenSideBar ? 'initial' : 'center',
    minHeight: 48,
    px: 2.5,
    // whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
  }), [isOpenSideBar]);

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isOpenSideBar}
        onClick={handleSideBarClose}
      />
      <Drawer
        ref={drawerRef}
        variant="permanent"
        open={isOpenSideBar}
        sx={{ zIndex: 7050, position: 'relative' }}
      >
        {isOpenSideBar && (
          <Box
            onMouseDown={handleMouseDown}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '5px',
              cursor: 'ew-resize',
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s',
              '&:hover': { backgroundColor: '#c1c3c5b4;' },
              zIndex: 1200,
            }}
          />
        )}

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
        <Box sx={{ width: `${width}px` }} role="presentation">
          <List>
            {pages.map(
              (page) =>
                page.roles.includes(userRole) && (
                  <ListItem key={page.label} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      onClick={() => {
                        handleSideBarOpen();
                        changeOpenedItem(page.label);
                      }}
                      sx={sxListItemButton}
                    >
                      {isOpenSideBar && createExpandIcon(page, currentOpenedItem)}
                      <ListItemIcon
                        sx={sxIconListItem}
                      >
                        {page.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={page.label} 
                        sx={{ opacity: isOpenSideBar ? 1 : 0 }} 
                        primaryTypographyProps={{ noWrap: true }} 
                      />
                    </ListItemButton>

                    {page?.content && (
                      <Collapse in={currentOpenedItem === page.label} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {page.content.map(
                            (subPage) =>
                              subPage.roles.includes(userRole) && (
                                <ListItemButton
                                  key={subPage.label}
                                  sx={{ pl: 5, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                                  
                                  onClick={() => handleNavigate(subPage.to)}
                                >
                                  <ListItemText
                                    primary={subPage.label}
                                    primaryTypographyProps={{ noWrap: true }}
                                  />
                                </ListItemButton>
                              )
                          )}
                        </List>
                      </Collapse>
                    )}
                  </ListItem>
                )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default SideBar2;