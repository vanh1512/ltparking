import { action, observable } from 'mobx';
import http from '@services/httpService';

import AppConsts, { RouterPath } from '@lib/appconst';
import LoginModel from '@models/Login/loginModel';
// import { AuthenticateModel, ExternalAuthenticateModel, ExternalLoginProviderInfoModel, TokenAuthService } from '@services/services_autogen';
import HistoryHelper from '@src/lib/historyHelper';
import { message } from 'antd';

declare var abp: any;

class AuthenticationStore {
	// private tokenAuthService: TokenAuthService;

	@observable loginModel: LoginModel = new LoginModel();
	// @observable listExternalAuthenticate: ExternalLoginProviderInfoModel[] = [];
	constructor() {
		// this.tokenAuthService = new TokenAuthService("", http);
	}
	get isAuthenticated(): boolean {
		if (!abp.session.userId) return false;

		return true;
	}

	
}
export default AuthenticationStore;
