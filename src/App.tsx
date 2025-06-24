import './App.css';

import * as React from 'react';

import Router from '@components/Router';
import SessionStore from '@stores/sessionStore';
import Stores from '@stores/storeIdentifier';
import { inject } from 'mobx-react';
import signalRAspNetCoreHelper from '@lib/signalRAspNetCoreHelper';
import { stores } from './stores/storeInitializer';
import PlateScanner from './PlateScanner';

export interface IAppProps {
	sessionStore?: SessionStore;
}

@inject(Stores.SessionStore)
class App extends React.Component<IAppProps> {
	state = {
		isLoadDone: false,
	}
	async componentDidMount() {
		const session = this.props.sessionStore;
		await stores.settingStore.getAll();
		await session!.getCurrentLoginInformations();

		if (session!.isUserLogin() == true) {
			let user = session!.getUserLogin();
			await signalRAspNetCoreHelper.initConnection();
			await signalRAspNetCoreHelper.startConnection(user.id);

		}
		this.setState({ isLoadDone: !this.state.isLoadDone });
	}

	public render() {
		return <PlateScanner />;
	}
}

export default App;
