import http from '@services/httpService';
import { CreateImportRepositoryInput, RepositoryDto, ImportRepositoryDto, CreateRepositoryInput, ERepositoryProductStatus, NotificationService, UserNotification, UpdateStateNotificationInput, PageResultNotificationDto, CustomUserNotification, UserNotificationState } from '@services/services_autogen';
import { action, observable } from 'mobx';
export class NotificationStore {
	private notificationService: NotificationService;

	@observable totalNotification: number = 0;
	@observable totalUnreadNotification: number = 0;
	@observable notificationListResult: CustomUserNotification[] = [];
	constructor() {
		this.notificationService = new NotificationService("", http);
	}

	@action
	public getAll = async ( skipCount: number | undefined, maxResultCount: number | undefined) => {
		let result = await this.notificationService.getUserNotifications( skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalNotification = result.totalCount;
			this.totalUnreadNotification = result.numberOfUnreadMessage;
			this.notificationListResult = result.items;
		}
	}
	@action
	public updateStateNotification = async (input: UpdateStateNotificationInput) => {
		if (input != undefined && input.notificationId != "" && input.notificationId != undefined) {
			let result: boolean = await this.notificationService.updateStateNotification(input);
			if (!!result) {
				this.notificationListResult = this.notificationListResult.map((x: CustomUserNotification) => {
					if (x.userNotification.id === input.notificationId) {
						let resultBool = x.userNotification.state;
						if (resultBool == UserNotificationState._0) {
							x.userNotification.state = UserNotificationState._1;
							this.totalUnreadNotification--;
						} else {
							x.userNotification.state = UserNotificationState._0;
							this.totalUnreadNotification++;
						}
					}
					return x;
				});
				return result
			} else return false

		}
	}
	@action
	public addNotification = async (data: CustomUserNotification) => {
		if (data != undefined) {
			this.notificationListResult.unshift(data);
			this.totalUnreadNotification++;
			this.totalNotification++;
		}
	}
	@action
	public updateAllStateNotification = async (typeNotification: number | undefined) => {
		let result: boolean = await this.notificationService.updateAllStateNotification(typeNotification);

		if (!!result) {
			this.notificationListResult = this.notificationListResult.map((item) => {
				if (item.userNotification.state == UserNotificationState._0) {
					item.userNotification.state = UserNotificationState._1;
					this.totalUnreadNotification--;
				}

				return item;
			});
			return result
		} else return false;
	}
}

export default NotificationStore;