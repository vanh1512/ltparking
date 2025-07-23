import http from '@services/httpService';
import {
	GetCurrentLoginInformationsOutput,
	SessionService,
	UserDto,
	UserLoginInfoDto,
} from '@src/services/services_autogen';
import { action, observable } from 'mobx';
import { stores } from './storeInitializer';
import { DataNode } from 'antd/lib/tree';
import { L } from '@lib/abpUtility';

class SessionStore {
	private sessionService: SessionService;
	@observable
	currentLogin: GetCurrentLoginInformationsOutput = new GetCurrentLoginInformationsOutput();

	constructor() {
		this.sessionService = new SessionService('', http);
	}
	@action
	async getCurrentLoginInformations() {
		let result = await this.sessionService.getCurrentLoginInformations();
		this.currentLogin = result;
	}

	isUserLogin(): boolean {
		if (this.currentLogin !== undefined && this.currentLogin.user !== undefined) {
			return true;
		}
		return false;
	}
	getTenant(): boolean {
		if (this.currentLogin?.tenant) {
			return true;
		}
		return false;
	}
	getUserLogin(): UserLoginInfoDto {
		if (this.isUserLogin()) {
			return this.currentLogin.user!;
		}
		return <any>undefined;
	}
	getNameUserLogin = () => {
		if (this.isUserLogin()) {
			return this.currentLogin.user!.name;
		} else return 'Người dùng không tồn tại';
	};
	getAllUsers = (): UserDto[] => {
		if (this.currentLogin !== undefined && this.currentLogin.users !== undefined) {
			return this.currentLogin.users!;
		}
		return [];
	};
}

export default SessionStore;
