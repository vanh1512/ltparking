import AccountStore from '@stores/accountStore';
import AuditLogStore from '@stores/auditLogStore';
import AuthenticationStore from '@stores/authenticationStore';
import RoleStore from '@stores/roleStore';
import SessionStore from '@stores/sessionStore';
import TenantStore from '@stores/tenantStore';
import UserStore from '@stores/userStore';
import ApplicationStore from './appicationStore';
import HookSendAttempt from './hookSendAttempt';
import WebHookSubcription from './hookSubscriptionStore';
import SettingStore from './settingStore';
import NotificationStore from './notificationStore';
import FastApiStore from './FastApiStore';

function initializeStores() {

	return {
		authenticationStore: new AuthenticationStore(),
		roleStore: new RoleStore(),
		tenantStore: new TenantStore(),
		userStore: new UserStore(),
		sessionStore: new SessionStore(),

		accountStore: new AccountStore(),
		auditLogStore: new AuditLogStore(),

		webHookSubcriptionStore: new WebHookSubcription(),
		hookSendAttemptStore: new HookSendAttempt(),
		applicationStore: new ApplicationStore(),
		settingStore: new SettingStore(),
		notificationStore: new NotificationStore(),
		fastApiStore: new FastApiStore(),
	};
}
export const stores = initializeStores();
