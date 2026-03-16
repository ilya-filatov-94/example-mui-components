import { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import SideBar2 from '../SideBar2';
import styles from './Layout.module.css';
import Loader from '../Loader';
import { drawerHeight } from '../SideBar/consts';
import NavBar from '../NavBar';

const Layout: FC = () => {
  return (
    <>
      <CssBaseline />
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <SideBar2 />
        <div className={styles.wrapperLayout}>
          <NavBar />
          <div className={styles.layout} style={{ height: `calc(100% - ${drawerHeight + 3})px`}}>
            <Suspense fallback={<div className={styles.wrapperFallbackForOutlet}><Loader /></div>}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout;
