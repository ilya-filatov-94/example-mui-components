import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { 
  rootRoute, 
  treeSystemsRoute, 
  resizePanelRoute,
  dialogWithProgressBarRoute
} from './routes';
import Layout from '../Layout';

const HomePage = lazy(() => import('../../pages/HomePage'));
const SystemsPage = lazy(() => import('../../pages/SystemsPage'));
const ResizePanel = lazy(() => import('../../pages/ResizePanel'));
const DialogWithProgressBar = lazy(() => import('../../pages/DialogWithProgressBar'));
 
function Routing() {
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
                  element={<ResizePanel />}
                />
                <Route 
                  path={dialogWithProgressBarRoute}
                  element={<DialogWithProgressBar />}
                />
            </Route>
        </Routes>
    )
}

export default Routing;