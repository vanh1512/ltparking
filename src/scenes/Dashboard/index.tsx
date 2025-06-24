import { CloudOutlined, GlobalOutlined, InsertRowBelowOutlined, ShoppingCartOutlined, ToolOutlined } from '@ant-design/icons';

import { L } from '@src/lib/abpUtility';
import AppConsts, { RouterPath, cssColResponsiveSpan } from '@src/lib/appconst';
import { eKindOfDay, eKindofChart, valueOfeKindOfDay } from '@src/lib/enumconst';
import signalRAspNetCoreHelper from '@src/lib/signalRAspNetCoreHelper';
import { DashboardDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { Card, Col, Modal, Row, Space } from 'antd';
import moment from 'moment';
import * as React from 'react';
import { Link } from 'react-router-dom';
import BarChartExample1Field3 from './components/BarChartExample1Field3';
import BarChartExample1Field4 from './components/BarChartExample1Field4';
import BarChartExample2Field from './components/BarChartExample2Field';
import PieChartPaymentType, { Data } from './components/PieChartExample';
import './index.less';
export class Dashboard extends React.PureComponent<any> {
	state = {
		cardLoading: true,
		lineChartLoading: true,
		barChartLoading: true,
		pieChartLoading: true,
		currentIndex: 0,
		month_current: undefined,
		date_current: undefined,
		kindOfDay: 1,
		kindOfChart: 1,
		isLoadDone: false,
		isVisibleModalDashboardChartProductMoneyAndQuantity: false,
	};
	dashboard: DashboardDto = new DashboardDto();

	interval: any;
	async componentDidMount() {
		this.setState({ isLoadDone: false });
		this.setState({ month_current: moment().format("M"), date_current: moment().format("D") })
		setTimeout(() => this.setState({ cardLoading: false }), 1000);
		setTimeout(() => this.setState({ lineChartLoading: false }), 1500);
		setTimeout(() => this.setState({ barChartLoading: false }), 2000);
		setTimeout(() => this.setState({ pieChartLoading: false }), 1000);
		await stores.dashboardStore.getAllDashboardChartProductMoneyAndQuantity(this.state.kindOfDay, 10);
		await this.getAll();
		//await signalRAspNetCoreHelper.registerNotificationHandler(['createRefund', 'createReport', 'createBilling'], [this.getAll.bind(this), this.getAllDashboardChartProductMoneyAndQuantity.bind(this)]);
		this.setState({ isLoadDone: true });

	}
	async getAllDashboardChartProductMoneyAndQuantity() {
		this.setState({ isLoadDone: false });
		const { general } = stores.settingStore.hostSetting;
		let numberOfMachine = this.state.isVisibleModalDashboardChartProductMoneyAndQuantity ? general.soLuongMayToiDaHienThiLenDashboard : 10;
		await stores.dashboardStore.getAllDashboardChartProductMoneyAndQuantity(this.state.kindOfDay, numberOfMachine);
		this.setState({ isLoadDone: true });
	}
	openCloseModalDashboardChartProductMoneyAndQuantity = async (visible: boolean, kindofChart: number) => {
		await this.setState({
			isVisibleModalDashboardChartProductMoneyAndQuantity: visible,
			kindOfChart: kindofChart,
		});

		await this.getAllDashboardChartProductMoneyAndQuantity();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		this.dashboard = await stores.dashboardStore.getAll();
		this.setState({ isLoadDone: true });
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		const { dashbroadListResult, total_money, totalBilling, totalRefund } = stores.dashboardStore;

		const stickySection = (
			<section className="sticky">
				<div className="bubbles">
					{[...Array(10)].map((_, index) => (
						<div key={index} className="bubble"></div>
					))}
				</div>
			</section>
		);
		const { cardLoading, barChartLoading, pieChartLoading } = this.state;
		const { dashboard } = this;
		const { general } = stores.settingStore.hostSetting;

		return (
			<div></div>
		);
	}
}

export default Dashboard;
