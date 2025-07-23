import './index.less';
import * as React from 'react';
import { Button, Carousel, Checkbox, Col, Form, Input, message, Modal, Row } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { FormInstance } from 'antd/lib/form';
import { L } from '@lib/abpUtility';
import AppConsts, { formatStringDMYhms } from '@src/lib/appconst';
import rules from '@src/components/Validation';
import signalRAspNetCoreHelper from '@src/lib/signalRAspNetCoreHelper';
import PlateScanner from '../SystemManager/PlateScanner';
import { eShiftStatus } from '@src/lib/enumconst';
import moment from 'moment';
import VehicleTicketPrint from '../SystemManager/VehicleTicketPrint';

const { confirm } = Modal;
const FormItem = Form.Item;

@observer
class Login extends React.Component {
	static shiftID = 0;
	static gateID = 0;
	formRef = React.createRef<FormInstance>();
	infor: any;
	state = {
		isLogin: false,
		isLoadDone: false,
		bodyLogin: undefined,
		checkboxLogin: false,
		aaaaaa: false,
	};
	async componentDidMount() {
		var checkboxLogin = localStorage.getItem("checkboxLogin");

		await this.setState({ checkboxLogin: checkboxLogin == "true" ? true : false })
		if (checkboxLogin) {
			this.formRef.current?.setFieldsValue({ Username: localStorage.getItem("Username"), password: localStorage.getItem("password") })
		}
		signalRAspNetCoreHelper.registerNotificationHandler(['login'], [this.login]);
		// const connection = new signalR.HubConnectionBuilder()
		// 	.withUrl(AppConsts.remoteServiceBaseUrl + "migvnotify",)
		// 	.build();

		// connection.on("login", async (data) => {
		// 	this.login(data);
		// });

		// connection
		// 	.start()
		// 	.then(() => {
		// 		console.log("🔗 SignalR Connected");
		// 	})
		// 	.catch((err) => {
		// 		console.error("❌ Connection error:", err);
		// 	});
		await this.setState({ isLoadDone: !this.state.isLoadDone })

	}
	login = async (data) => {
		data = JSON.parse(data);
		let self = this;

		if (data.ShiftStatus == eShiftStatus.YES.num) {
			confirm({
				title: (
					<>
						Ca làm việc lần trước bắt đầu lúc <strong>{data.Note}</strong> vẫn chưa đóng. Bạn có muốn tiếp tục ca làm việc không?
					</>
				),
				okText: L('Có'),
				cancelText: L('Không, bắt đầu ca mới'),
				async onOk() {
					await self.setState({ bodyLogin: { ...(self.state.bodyLogin || {}), ShiftStatus: eShiftStatus.YES.num } })
					await self.sendRequest(self.state.bodyLogin);
					message.success(L("Tiếp tục"))
				},
				async onCancel() {
					await self.sendRequest({ ...(self.state.bodyLogin || {}), ShiftStatus: eShiftStatus.NO.num });
					message.success("Bắt đầu ca làm việc mới:" + moment().format(formatStringDMYhms), 5) // tính bằng giây
				},
			});
		}
		else if (data.Status == false) {
			message.error(L("Đã có phiên đăng nhập khác. Vui lòng kiểm tra lại!!!"))
			//window.location.reload();
		}
		else if (data.Status == true) {
			await this.setState({ isLogin: true });
			Login.shiftID = Number(data.Note.split(',')[0]);
			Login.gateID = Number(data.Note.split(',')[1]);
			localStorage.setItem("shiftID", data.Note.split(',')[0]);
			localStorage.setItem("gateID", data.Note.split(',')[1]);
		}
		else
			message.error(data["Note"])
	}
	handleSubmit = async (values: any) => {
		await this.setState({ bodyLogin: { ...values, ShiftStatus: 0 } })
		await this.sendRequest(this.state.bodyLogin);

		localStorage.setItem("checkboxLogin", this.state.checkboxLogin.toString());

		if (this.state.checkboxLogin) {
			localStorage.setItem("Username", values.Username);
			localStorage.setItem("password", values.password);
		}
		else {
			localStorage.clear();
		}
	};
	sendRequest = async (values: any) => {
		await fetch(AppConsts.remoteServiceBaseUrl + "api/services/app/FastAPI/Login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ result: JSON.stringify(values) })
		});

	};
	handleSaveVehicle = () => {
		this.infor.aaaa = "aaaaaa";
	};
	render() {
		return (

			this.state.isLogin ?
				<PlateScanner /> :
				<>
					<Row>
						<div style={{ position: 'relative' }}>
							<div style={{ position: 'absolute', zIndex: 100, top: 10, left: 10 }}>
								<img src={process.env.PUBLIC_URL + "/Logo_Client.png"} style={{ width: 'auto', height: 60 }}></img>
							</div>
							<Carousel autoplay autoplaySpeed={5000} className='login-form-carousel'>
								<div><img src={process.env.PUBLIC_URL + "/bg_login_2.png"} style={{ height: '100vh', width: '100%', objectFit: 'cover' }}></img></div>
								<div><img src={process.env.PUBLIC_URL + "/bg_login_1.jpg"} style={{ height: '100vh', width: '100%', objectFit: 'cover' }}></img></div>
								<div><img src={process.env.PUBLIC_URL + "/bg_login_3.jpg"} style={{ height: '100vh', width: '100%', objectFit: 'cover' }}></img></div>
								<div><img src={process.env.PUBLIC_URL + "/bg_login_4.jpg"} style={{ height: '100vh', width: '100%', objectFit: 'cover' }}></img></div>
								<div><img src={process.env.PUBLIC_URL + "/bg_login_5.jpg"} style={{ height: '100vh', width: '100%', objectFit: 'cover' }}></img></div>
							</Carousel>
						</div>
						<div className='login-form-info'>
							<Row justify='center'>
								<h1 style={{ fontWeight: 'bold', marginTop: '5vh', color: 'rgb(254, 146, 22)' }}>LifeTechParking</h1>
							</Row>
							<Row className='login-form-input' justify='center'>
								<Row justify='center'>
									<img src={process.env.PUBLIC_URL + "/Logo_Client.png"} style={{ width: '70px', height: "70px", margin: "15px 0 20px 0" }} />
								</Row>
								<Col offset={3} span={18}>
									<Form onFinish={this.handleSubmit} ref={this.formRef}>
										<p className='login-form-label'>{L('Tên đăng nhập')}</p>
										<FormItem name={'Username'} rules={[rules.required]}>
											<Input
												maxLength={AppConsts.maxLength.name}
												placeholder={L('Tên đăng nhập')}
												prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)', paddingRight: '5px' }} />}
												size="large"
												style={{ width: '100%', height: '44px', borderRadius: '7px' }}
											/>
										</FormItem>
										<p className='login-form-label'>{L('Mật khẩu')}</p>
										<FormItem name={'password'} rules={[rules.required]}>
											<Input.Password
												placeholder={L('Mật khẩu')}
												prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)', paddingRight: '5px' }} />}
												type="password"
												size="large"
												onPressEnter={this.handleSubmit}
												style={{ width: '100%', height: '44px', borderRadius: '7px' }}

											/>
										</FormItem>

										<Col style={{ fontSize: '15px', justifyItems: 'center' }}>
											<Checkbox checked={this.state.checkboxLogin} onChange={(e) => this.setState({ checkboxLogin: e.target.checked })}>Ghi nhớ đăng nhập</Checkbox>
											<Button
												htmlType={'submit'}
												type={"primary"}
												style={{ width: '100%', height: '40px', borderRadius: "20px", fontWeight: 700 }}
											>
												{L('Đăng nhập')}
											</Button>
										</Col>
										<Col style={{ fontSize: '15px', justifyItems: 'center' }}>
											<Button
												type={"primary"}
												style={{ width: '100%', height: '40px', borderRadius: "20px", fontWeight: 700 }}
												onClick={() => { this.infor = "aaaaaa"; this.setState({ aaaaaa: true }) }}
											>
												{L('In')}
											</Button>
										</Col>
									</Form>
								</Col>

							</Row>
						</div>

					</Row >
					{this.state.aaaaaa &&
						<VehicleTicketPrint vehicle={this.infor} onClose={() => this.setState({ aaaaaa: false })}></VehicleTicketPrint>
					}
				</>
		);
	}
}


export default Login;
