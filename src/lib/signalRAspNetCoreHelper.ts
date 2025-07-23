import AppConsts from './appconst';
import Util from '@utils/utils';
import * as signalR from '@microsoft/signalr';
declare var abp: any;

class SignalRAspNetCoreHelper {
	private connection: signalR.HubConnection | null = null;
	// initSignalR() {
	// 	var encryptedAuthToken = abp.utils.getCookieValue(AppConsts.authorization.encrptedAuthTokenName);

	// 	abp.signalr = {
	// 		autoConnect: true,
	// 		connect: undefined,
	// 		hubs: undefined,
	// 		qs: AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken),
	// 		remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl,
	// 		url: '/migvnotify'
	// 	};

	// 	Util.loadScript(AppConsts.appBaseUrl + '/abp.signalr-client.js');
	// }

	constructor() {
		this.connection = null;
	}
	getConnection() {
		return this.connection;
	}
	// Initialize the SignalR connection
	// initConnection() {
	// 	if (!this.connection) {

	// 		// this.connection = new signalR.HubConnectionBuilder()
	// 		// 	.withUrl(AppConsts.remoteServiceBaseUrl + "migvnotify",)
	// 		// 	.withAutomaticReconnect()
	// 		// 	.build();

	// 		this.connection = new signalR.HubConnectionBuilder()
	// 			.withUrl(AppConsts.remoteServiceBaseUrl + "migvnotify",
	// 				{
	// 					transport: signalR.HttpTransportType.LongPolling
	// 				})
	// 			.configureLogging(signalR.LogLevel.Information)
	// 			.build();

	// 	}
	// 	return this.connection;
	// }
	async initConnection() {
		try {
			console.log("Attempting initial SignalR connection (negotiation: WS → SSE → LongPolling)");

			this.connection = new signalR.HubConnectionBuilder()
				.withUrl(AppConsts.remoteServiceBaseUrl + "migvnotify")
				.configureLogging(signalR.LogLevel.Information)
				.withAutomaticReconnect()
				.build();
			this.connection.serverTimeoutInMilliseconds = 2000;
			await this.startConnection();
			this.connection.onclose(async (error) => {
				console.warn("Connection closed, error:", error);
				if (error && error.message.includes("Server timeout")) {
					console.log("Server timeout detected, switching to LongPolling fallback.");
					await this.switchToLongPolling();
				}
			});

		} catch (error) {
			console.warn("Initial connection failed, falling back to LongPolling immediately.", error);
			await this.switchToLongPolling();
		}
	}

	async switchToLongPolling() {
		try {
			if (this.connection) {
				console.log("Stopping existing SignalR connection before switching to LongPolling...");
				await this.connection.stop();
			}
		} catch (e) {
			console.warn("Error while stopping existing connection during fallback:", e);
		}

		try {
			console.log("Attempting SignalR connection with LongPolling fallback...");
			this.connection = new signalR.HubConnectionBuilder()
				.withUrl(AppConsts.remoteServiceBaseUrl + "migvnotify", {
					transport: signalR.HttpTransportType.LongPolling
				})
				.configureLogging(signalR.LogLevel.Information)
				.withAutomaticReconnect()
				.build();

			await this.startConnection();
			console.log("SignalR connected using LongPolling.");
		} catch (error) {
			console.error("Failed to connect with LongPolling fallback:", error);
		}
	}




	// Start the SignalR connection
	async startConnection() {
		await this.connection?.start();
		try {
			//Đăng ký người dùng
			await this.connection?.invoke("Register")
				.catch(function (err) {
					return console.error("Error registering user:", err.toString());
				});
			console.log("SignalR Connected!", this.connection?.state);

		} catch (err) {
			console.error("SignalR Connection Error: ", err);
		}
	}

	// Stop the SignalR connection
	async stopConnection(userId?: number) {
		if (this.connection) {
			try {
				this.connection!.invoke("UnRegister")
					.catch(function (err) {
						return console.error(err.toString());
					});
				await this.connection.stop().catch(function (err) {
					return console.error(err.toString());
				});
				console.log("SignalR Disconnected.");
			} catch (err) {
				console.error("Error disconnecting SignalR: ", err);
			}
		}
	}

	// Register an event handler for receiving messages
	registerNotificationHandler(methodNames: string[], callbacks) {
		if (this.connection) {
			methodNames.forEach((methodName) => {
				this.connection!.on(methodName, (data) => {
					// Iterate over the array of callback functions and call each one
					callbacks.forEach((callback) => {
						if (callback) {
							callback(data);  // Call each function
						}
					});
				});
			})
		}
	}


	// Send a message to the server
	async sendMessage(message) {
		if (this.connection) {
			try {
				await this.connection.invoke("SendNotify", message);
				console.log("Message sent: ", message);
			} catch (err) {
				console.error("Error sending message: ", err);
			}
		}
	}
}
export default new SignalRAspNetCoreHelper();
