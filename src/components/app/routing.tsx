import { lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { 
  rootRoute, 
  treeSystemsRoute, 
  resizePanelRoute,
  dialogWithProgressBarRoute,
  progressInNotificationRoute
} from './routes';
import Layout from '../Layout';

const HomePage = lazy(() => import('../../pages/HomePage'));
const SystemsPage = lazy(() => import('../../pages/SystemsPage'));
const ResizePanelPage = lazy(() => import('../../pages/ResizePanel'));
const DialogWithProgressBarPage = lazy(() => import('../../pages/DialogWithProgressBar'));
const ProgressInToastPage = lazy(() => import('../../pages/ProgressBarInNotification'));
 
function Routing() {
    useEffect(() => {
      console.log('чтение очереди операций')
    }, []);

    return (
        <Routes>
            <Route path={rootRoute} element={<Layout />}>
                <Route 
                  index
                  element={<HomePage />}
                />
                <Route 
                  path={treeSystemsRoute}
                  element={<SystemsPage />}
                />
                <Route 
                  path={resizePanelRoute}
                  element={<ResizePanelPage />}
                />
                <Route 
                  path={dialogWithProgressBarRoute}
                  element={<DialogWithProgressBarPage />}
                />
                <Route 
                  path={progressInNotificationRoute}
                  element={<ProgressInToastPage />}
                />
            </Route>
        </Routes>
    )
}

export default Routing;