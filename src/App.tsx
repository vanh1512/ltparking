import './App.css';
import * as React from 'react';
import SessionStore from '@stores/sessionStore';
import Stores from '@stores/storeIdentifier';
import { inject } from 'mobx-react';
import signalRAspNetCoreHelper from '@lib/signalRAspNetCoreHelper';
import Login from './scenes/Login';
import PlateScanner from './scenes/SystemManager/PlateScanner';
import { message, Spin } from 'antd';
import { HubConnectionState } from '@microsoft/signalr';

export interface IAppProps {
	sessionStore?: SessionStore;
}

@inject(Stores.SessionStore)
class App extends React.Component<IAppProps> {
	state = {
		isLoadDone: false,
		shiftID: 0,
	};

	async componentDidMount() {
		await signalRAspNetCoreHelper.initConnection();
		// await signalRAspNetCoreHelper.startConnection();
		var a = signalRAspNetCoreHelper.getConnection();
		if (a?.state == HubConnectionState.Disconnected) {
			message.error("Tín hiệu SignalR chưa được kết nối. Vui lòng tải lại trang hoặc liên hệ quản lý!!!", 5);
			return;
		}
		const savedShiftID = localStorage.getItem("shiftID");
		const shiftID = savedShiftID ? Number(savedShiftID) : 0;

		if (shiftID > 0) {
			Login.shiftID = shiftID;
			Login.gateID = localStorage.getItem("gateID") ? Number(localStorage.getItem("gateID")) : 0
		}

		this.setState({
			isLoadDone: true,
			shiftID,
		});
	}


	public render() {
		const { isLoadDone, shiftID } = this.state;

		if (!isLoadDone) {
			return <div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
				}}
			>
				<Spin size="large" tip="Loading..." />
			</div>;
		}

		return (
			<>
				{shiftID <= 0 ? <Login /> : <PlateScanner />}
			</>
		);
	}
}


export default App;
