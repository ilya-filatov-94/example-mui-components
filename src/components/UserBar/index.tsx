import { FC } from 'react';
import Logout from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from './NavBar.module.css';
import { NoMaxWidthTooltip } from '../NoMaxWidthTooltip';

const NavBar: FC = () => {
  const userFIO = 'Петров Пётр Петрович';
  const currentRole = 'Администратор ИТ услуги';

  return (
    <div className={styles.wrapperNavBar}>
      <div className={styles.wrapperUserBar}>
        <AccountCircleIcon 
          sx={{ 
            height: '2.5rem',
            width: '2.5rem'
          }}
        />
        <div className={styles.wrapperUserData}>
          <label className={styles.label}>{userFIO}</label>
          <label className={styles.subLabel}>{currentRole}</label>
        </div>
      </div>
      <NoMaxWidthTooltip
        title="Выйти"
        placement='bottom'
        arrow
        sx={{
          '& .MuiTooltip-tooltip': {
            backgroundColor: '#000',
          },
          '& .MuiTooltip-popperArrow': {
            backgroundColor: '#000',
            color: '#000'
          }
        }}>
          <IconButton aria-label="logout">
            <Logout />
          </IconButton>
        </NoMaxWidthTooltip>
    </div>
  )
}

export default NavBar;
