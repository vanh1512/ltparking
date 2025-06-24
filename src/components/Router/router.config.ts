import { HomeOutlined } from '@ant-design/icons';
import LoadableComponent from '@components/Loadable/index';
import { RouterPath } from '@src/lib/appconst';
import { L } from '@src/lib/abpUtility';
import { guestRouter } from './router_guest.config';
export const appRouters: any = [
	{
		path: RouterPath.admin_dashboard,
		key: '0',
		name: 'dashboard',
		permission: '',
		title: L('Trang_chu'),
		icon: HomeOutlined,
		showInMenu: true,
		component: LoadableComponent(() => import('@scenes/Dashboard')),
	},

	// appGeneralRouters,

	
	{
		path: RouterPath.admin_logout,
		permission: '',
		key: '0',
		title: 'Logout',
		name: 'logout',
		icon: 'info-circle',
		showInMenu: false,
		component: LoadableComponent(() => import('@components/Logout'))
	},
];

export const routers = [...guestRouter, ...appRouters];
