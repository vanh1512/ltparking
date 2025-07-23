import { CloudOutlined, GlobalOutlined, InsertRowBelowOutlined, ShoppingCartOutlined, ToolOutlined } from '@ant-design/icons';

import { L } from '@src/lib/abpUtility';
import AppConsts, { RouterPath, cssColResponsiveSpan } from '@src/lib/appconst';
import signalRAspNetCoreHelper from '@src/lib/signalRAspNetCoreHelper';
import { stores } from '@src/stores/storeInitializer';
import { Card, Col, Modal, Row, Space } from 'antd';
import moment from 'moment';
import * as React from 'react';
import { Link } from 'react-router-dom';
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

	interval: any;
	async componentDidMount() {
		this.setState({ isLoadDone: false });
		this.setState({ month_current: moment().format("M"), date_current: moment().format("D") })
		setTimeout(() => this.setState({ cardLoading: false }), 1000);
		setTimeout(() => this.setState({ lineChartLoading: false }), 1500);
		setTimeout(() => this.setState({ barChartLoading: false }), 2000);
		setTimeout(() => this.setState({ pieChartLoading: false }), 1000);
		
		this.setState({ isLoadDone: true });

	}
	
	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {


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
		const { general } = stores.settingStore.hostSetting;

		return (
			<div></div>
		);
	}
}

export default Dashboard;
