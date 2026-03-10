import SchemaOutlinedIcon from "@mui/icons-material/SchemaOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import { rootRoute, treeSystemsRoute, resizePanelRoute } from './routes';

export type TContentPage = {
    label: string;
    to: string;
    roles: string[];
}

export type TPage = {
    label: string;
    icon: React.ReactNode;
    roles: string[];
    content?: TContentPage[];
}

const pages: TPage[] = [
    {
        label: 'Домашняя',
        icon: <HomeOutlinedIcon />,
        roles: ['USER'],
        content: [
            {
                label: 'Домашняя страница',
                to: rootRoute,
                roles: ['USER']
            }
        ]
    },
    {
        label: 'Дерево систем',
        icon: <SchemaOutlinedIcon />,
        roles: ['USER'],
        content: [
            {
                label: 'Системы',
                to: treeSystemsRoute,
                roles: ['USER']
            }
        ]
    },
    {
        label: 'Панель с изменяемой шириной',
        icon: <FeedOutlinedIcon />,
        roles: ['USER'],
        content: [
            {
                label: 'Панель с изменяемой шириной',
                to: resizePanelRoute,
                roles: ['USER']
            }
        ]
    },

];

export default pages;
