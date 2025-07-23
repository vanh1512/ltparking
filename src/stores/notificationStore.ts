import http from '@services/httpService';
import { action, observable } from 'mobx';
export class NotificationStore {

	@observable totalNotification: number = 0;
	@observable totalUnreadNotification: number = 0;
	constructor() {
	}

	
}

export default NotificationStore;