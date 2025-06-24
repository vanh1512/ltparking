import './index.less';
import * as React from 'react';
import { Button, Carousel, Col, Drawer, Form, Input, Modal, Row } from 'antd';
import { UserOutlined, LockOutlined, LogoutOutlined, KeyOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import AccountStore from '@stores/accountStore';
import AuthenticationStore from '@stores/authenticationStore';
import { FormInstance } from 'antd/lib/form';
import { L } from '@lib/abpUtility';
import { Link, Redirect } from 'react-router-dom';
import SessionStore from '@stores/sessionStore';
import Stores from '@stores/storeIdentifier';
import TenantAvailabilityState from '@services/account/dto/tenantAvailabilityState';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import ResetPassword from './Forgot';
import rules from '@src/components/Validation';

const FormItem = Form.Item;
declare var abp: any;
export interface ILoginProps {
	authenticationStore?: AuthenticationStore;
	sessionStore?: SessionStore;
	accountStore?: AccountStore;
	history: any;
	location: any;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Login extends React.Component<ILoginProps> {
	formRef = React.createRef<FormInstance>();
	state = {
		visibleRegister: false,
		visibleResetPass: false,
	};

	changeTenant = async () => {
		let localStorageTenant = localStorage.getItem('tenantName')!;

		let tenancyName = (this.formRef.current?.getFieldValue('tenancyName') || this.formRef.current?.getFieldValue('tenancyName') == "") ? this.formRef.current?.getFieldValue('tenancyName') : localStorageTenant;
		const { loginModel } = this.props.authenticationStore!;
		if (!tenancyName) {
			abp.multiTenancy.setTenantIdCookie(undefined);
			return;
		} else {
			await this.props.accountStore!.isTenantAvailable(tenancyName);
			const { tenant } = this.props.accountStore!;
			let state: number = tenant.state!;

			switch (state) {
				case TenantAvailabilityState.Available:
					abp.multiTenancy.setTenantIdCookie(tenant.tenantId);
					loginModel.tenancyName = tenancyName;
					loginModel.toggleShowModal();
					return;
				case TenantAvailabilityState.InActive:
					Modal.error({ title: L('Error'), content: L('TenantIsNotActive') });
					break;
				case TenantAvailabilityState.NotFound:
					Modal.error({ title: L('Error'), content: L('ThereIsNoTenantDefinedWithName{0}', tenancyName) });
					break;
			}
		}
	};

	handleSubmit = async (values: any) => {
		await this.changeTenant();
		const { loginModel } = this.props.authenticationStore!;
		await this.props.authenticationStore!.login(values);
		sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
		localStorage.setItem('tenantName', loginModel.tenancyName || "");
		const { state } = this.props.location;
		window.location = state ? state.from.pathname : '/';
	};

	render() {

		let { from } = this.props.location.state || { from: { pathname: '/' } };
		if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;
		return (
			<>
				<Row>
					<Drawer
						title={L('quen_mat_khau') + "?"}
						width={500}
						maskClosable={false}
						closable={true}
						visible={this.state.visibleResetPass}
						headerStyle={{ justifyContent: 'center', display: 'flex' }}
						placement='right'
						onClose={() => this.setState({ visibleResetPass: false })}
					>
						<ResetPassword />
					</Drawer>
					<div style={{ position: 'relative' }}>
						<div style={{ position: 'absolute', zIndex: 100, top: 10, left: 10 }}>
							<img src={process.env.PUBLIC_URL + "/logo_mig.png"} style={{ width: 'auto', height: 60 }}></img>
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
						<h1 style={{ fontWeight: 'bold', marginTop: '5vh', color: 'rgb(254, 146, 22)' }}>Vending Machine</h1>
						<h2 style={{ fontWeight: 'bold' }}>{L('dang_nhap')}</h2>
						<Row className='login-form-input'>
							<img src={process.env.PUBLIC_URL + "/vending_machine_icon.png"} style={{ width: '70px', height: "70px", margin: "15px 0 20px 0" }} />
							<Col offset={3} span={18}>
								<Form onFinish={this.handleSubmit} ref={this.formRef}>
									<p className='login-form-label'>Tenancy</p>
									<FormItem name={'tenancyName'}
									// rules={[rules.required, rules.maxName, rules.noSpaces] }
									>
										<Input
											defaultValue={(localStorage.getItem('tenantName')! || "")}
											prefix={<KeyOutlined style={{ color: 'rgba(0,0,0,.25)', paddingRight: '5px' }} />}
											placeholder={L('Tenancy')}
											value={(localStorage.getItem('tenantName')! || "")}
										/>
									</FormItem>
									<p className='login-form-label'>{L('ten_dang_nhap')}</p>
									<FormItem name={'userNameOrEmailAddress'} rules={[rules.required, rules.noSpaces]}>
										<Input
											maxLength={AppConsts.maxLength.name}
											placeholder={L('UserNameOrEmail')}
											prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)', paddingRight: '5px' }} />}
											size="large"
											style={{ width: '100%', height: '44px', borderRadius: '7px' }}
										/>
									</FormItem>
									<p className='login-form-label'>{L('mat_khau')}</p>
									<FormItem name={'password'} rules={[rules.required, rules.password]}>
										<Input.Password
											placeholder={L('Password')}
											prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)', paddingRight: '5px' }} />}
											type="password"
											size="large"
											//onPressEnter={this.handleSubmit}
											style={{ width: '100%', height: '44px', borderRadius: '7px' }}
										/>
									</FormItem>

									<Row style={{ marginTop: '-15px' }}>
										<FormItem>
											<a className='login-form-label' onClick={() => this.setState({ visibleResetPass: true })}><LogoutOutlined /> <u>{L('quen_mat_khau')}?</u></a>
										</FormItem>
									</Row>
									<Col style={{ fontSize: '15px', justifyItems: 'center' }}>
										<Button
											htmlType={'submit'}
											type={"primary"}
											style={{ width: '100%', height: '40px', borderRadius: "20px", fontWeight: 700 }}
										>
											{L('dang_nhap')}
										</Button>
									</Col>
								</Form>
							</Col>

						</Row>
						<div style={{ fontFamily: "Arial, sans-serif", padding: "20px",  textAlign: "left" }}>
							<p style={{ fontSize: "18px", fontWeight: "bold", color: 'rgb(254, 146, 22)', }}>
								Ngoài ra chúng tôi còn cung cấp các dịch vụ khác như:
							</p>
							<ol className='ol_login' style={{ listStyle: "none", padding: 0 }}>
								<li style={{ margin: "10px 0", fontSize: "13px" }}>✅ <a target='_blank' href="https://migviet.com/giai-phap-so-hoa-di-tich-bao-tang-dia-diem-du-lich/">Giải pháp số hóa di tích, bảo tàng, địa điểm du lịch</a></li>
								<li style={{ margin: "10px 0", fontSize: "13px" }}>✅ <a target='_blank' href="https://migviet.com/he-thong-quan-ly-chat-luong-san-pham/">Giải pháp CDS cho các dây chuyền Sản xuất trong nhà máy</a></li>
								<li style={{ margin: "10px 0", fontSize: "13px" }}>✅ <a target='_blank' href="https://migviet.com/phan-mem-so-hoa-va-quan-ly-ho-so-luu-tru-dien-tu-mig-ocr/">Phần Mềm Số Hóa, Quản Lý Hồ Sơ Lưu Trữ Điện Tử</a></li>
								<li style={{ margin: "10px 0", fontSize: "13px" }}>✅ <a target='_blank' href="https://migviet.com/2021/11/07/mig-elearning/">Mig E - Learning</a></li>
								<li style={{ margin: "10px 0", fontSize: "13px" }}>✅ <a target='_blank' href="https://migviet.com/he-thong-mo-phong-lai-xe-o-to/">Hệ Thống Mô Phỏng Lái Xe</a></li>
								<li style={{ margin: "10px 0", fontSize: "13px" }}>✅ <a target='_blank' href="https://migviet.com/giai-phap-tong-the-truyen-thong-va-quang-cao-ky-thuat-so-mig-digital-signage/">Mig Digital Signage - Giải Pháp Quảng Cáo Số</a></li>
							</ol>
						</div>

					</div>

				</Row >
			</>
		);
	}
}

export default Login;
