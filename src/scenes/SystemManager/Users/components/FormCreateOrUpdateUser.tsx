import * as React from 'react';
import { Checkbox, Input, Tabs, Form, Card, Button, message, Col, Row } from 'antd';
import { L } from '@lib/abpUtility';
import { CreateRepositoryInput, CreateUserDto, RoleDto, UpdateUserInput, UserDto } from '@services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import rules from '@src/components/Validation';
const TabPane = Tabs.TabPane;

export interface IProps {
	onCancel: () => void;
	onCreateOrUpdatedSuccess: () => void;
	userSelected: UserDto;
	userListResult?: UserDto[];
}
class OptionValue {
	lable = '';
	value = '';
	constructor() { }
}
export default class FormCreateOrUpdateUser extends React.Component<IProps> {

	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		confirmDirty: false,
		userId: -1,
		isActive: true,
		usIdSelected: undefined
	};
	userSelected: UserDto;
	optionsRoles: any;
	async componentDidMount() {
		await this.initData(this.props.userSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.userSelected.id !== prevState.userId) {
			return {
				userId: nextProps.userSelected.id,
				isActive: nextProps.userSelected.isActive || true,
				confirmDirty: false,
			};
		}
		return null;
	}
	async componentDidUpdate(prevProps, prevState) {
		if (this.props.userSelected.id !== prevProps.userSelected.id) {
			this.setState({ userId: this.props.userSelected.id });
			await this.initData(this.props.userSelected);
		}
	}

	initData = async (userInput: UserDto | undefined) => {
		this.setState({ isLoadDone: false });
		await stores.userStore.getRoles();
		const { roles } = stores.userStore;

		if (userInput != undefined) {
			this.userSelected = userInput!;
		} else {
			this.userSelected = new UserDto();
		}
		let roleDefault: string[] = [];
		this.optionsRoles = [];
		if (roles && roles.length > 0) {
			roles.map((x: RoleDto) => {
				if (x.isDefault) {
					roleDefault.push(x.name!);
				}
				this.optionsRoles.push({
					label: x.displayName!,
					value: x.name!
				});
			});
		}
		if (this.userSelected.id == undefined) {
			this.userSelected.roleNames = roleDefault;
		}
		this.formRef.current.setFieldsValue({ ...userInput, });
		this.setState({ isLoadDone: true });
	}

	compareToFirstPassword = (rule: any, value: any, callback: any) => {
		const form = this.formRef.current;
		if (value && value !== form.getFieldValue('password')) {
			return Promise.reject(L('mat_khau_khong_trung_nhau'));
		}
		return Promise.resolve();
	};

	validateToNextPassword = (rule: any, value: any) => {
		const form = this.formRef.current;
		if (value && value.length < 8) {
			return Promise.reject(L('mat_khau_toi_thieu_8_ky_tu'));
		}
		if (value && form.getFieldValue('confirm')) {
			form.validateFields(['confirm']);
		}
		return Promise.resolve();
	};

	onCancel = () => {
		if (this.props.onCancel != undefined) {
			this.props.onCancel();
		}
	}

	onCreateUpdate = () => {
		const form = this.formRef.current;
		let userList = this.props.userListResult?.slice();
		form!.validateFields().then(async (values: any) => {
			let roleNames = values.roleNames;
			//const isMachineSoft = userList!.some(item => item!.emailAddress!.trim().toLowerCase() === values.emailAddress.trim().toLowerCase());
			if (roleNames === undefined) {
				roleNames = [];
			}
			// if (isMachineSoft) {
			// 	message.error(L('email_da_duoc_su_dung'))
			// 	return;
			// }

			if (this.state.userId === undefined || this.state.userId < 0) {
				let createData = new CreateUserDto(values);
				createData.roleNames = roleNames;
				createData.isActive = this.state.isActive;
				await stores.userStore.create(createData);
				message.success(L("them_moi_thanh_cong") + "!");
			} else {
				let updateData = new UpdateUserInput({ id: this.state.userId, ...values });
				updateData.roleNames = roleNames;
				updateData.isActive = this.state.isActive;
				await stores.userStore.updateUser(updateData);
				message.success(L("chinh_sua_thanh_cong"));
			}

			if (this.props.onCreateOrUpdatedSuccess !== undefined) {
				await this.props.onCreateOrUpdatedSuccess();
			}
			this.setState({ isLoadDone: true });
		});
	}

	render() {

		const { userSelected, userListResult } = this.props;
		const listRole = userSelected.id != undefined ? userSelected.roleNames!.map(item => item.toUpperCase()) : [];
		let userList = userListResult?.slice();
		if (!!userSelected && userSelected.id != undefined) {
			userList = userListResult!.filter(item => item.id !== userSelected!.id!);
		}
		return (
			<Card >
				<Form ref={this.formRef}>
					<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
						<Col span={12}><h3>{this.state.userId === undefined ? L("them_nguoi_dung_moi") : L("chinh_sua_thong_tin_nguoi_dung") + ": " + userSelected.fullName}</h3></Col>
						<Col span={12} style={{ textAlign: 'right' }}>
							<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L("huy")}
							</Button>
							<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L("luu")}
							</Button>
						</Col>
					</Row>

					<Tabs defaultActiveKey={'userInfo'} size={'small'} tabBarGutter={64}>
						<TabPane tab={L("nguoi_dung")} key={'userInfo'}>
							<Form.Item label={L('ten')} {...AppConsts.formItemLayout} name={'name'} rules={[rules.gioi_han_ten, rules.required, rules.noAllSpaces,]} >
								<Input
									placeholder={L('ten') + '...'}
									maxLength={64}
									onChange={(e) => {
										if (e.target.value.length > 64) {
											e.preventDefault();
										}
									}}
								/>
							</Form.Item>
							<Form.Item label={L("ho")} {...AppConsts.formItemLayout} name={'surname'} rules={[rules.gioi_han_ten, rules.required, rules.noAllSpaces,]}>
								<Input
									placeholder={L("ho") + '...'}
									maxLength={64}
									onChange={(e) => {
										if (e.target.value.length > 64) {
											e.preventDefault();
										}
									}}
								/>
							</Form.Item>
							<Form.Item label={L("ten_dang_nhap")} {...AppConsts.formItemLayout} name={'userName'} rules={[rules.gioi_han_ten, rules.required, rules.noAllSpaces, ({ getFieldValue }) => ({
								validator(_, value) {
									const isMachineSoft = userList!.some(item => item!.userName!.trim().toLowerCase() === value.trim().toLowerCase());
									if (!value || !isMachineSoft) {
										return Promise.resolve();
									}
									return Promise.reject(new Error(L('ten_dang_nhap_da_ton_tai') + '!'));
								}
							})]}>
								<Input
									placeholder={L("ten_dang_nhap") + '...'}
									maxLength={64}
									onChange={(e) => {
										if (e.target.value.length > 64) {
											e.preventDefault();
										}
									}}
								/>
							</Form.Item>
							<Form.Item label={L('email')} {...AppConsts.formItemLayout} name={'emailAddress'}
								rules={[
									{ validator: (_, value) => 	rules.checkEmail(value)}]}>
								<Input
									placeholder={L('email') + '...'}
									maxLength={256}
									onChange={(e) => {
										if (e.target.value.length > 256) {
											e.preventDefault();
										}
									}}
								/>
							</Form.Item>
							{this.state.userId === undefined ? (
								<Form.Item
									label={L('mat_khau')}
									{...AppConsts.formItemLayout}
									name={'password'}
									rules={[
										{ required: true, message: L('khong_duoc_bo_trong') },
										{ min: 8, message: L('mat_khau_toi_thieu_8_ky_tu') },
										{ validator: this.validateToNextPassword }
									]}
									hasFeedback
								>
									<Input.Password placeholder={L('mat_khau') + '...'} />
								</Form.Item>
							) : null}
							{this.state.userId === undefined ? (
								<Form.Item
									label={L("xac_nhan_mat_khau")}
									{...AppConsts.formItemLayout}
									name={'confirm'}
									dependencies={['password']}
									rules={[
										{ required: true, message: L('khong_duoc_bo_trong') },
										{ validator: this.compareToFirstPassword }
									]}
									hasFeedback
								>
									<Input.Password placeholder={L("xac_nhan_mat_khau")} />
								</Form.Item>
							) : null}
							<Form.Item label={L('kich_hoat')} {...AppConsts.formItemLayout} name={'isActive'} valuePropName='checked'>
								<Checkbox onChange={(e) => this.setState({ isActive: e.target.checked })} ></Checkbox>
							</Form.Item>
						</TabPane>
						<TabPane tab={'vai_tro'} key={'rol'}>
							<Form.Item name={'roleNames'}>
								<Checkbox.Group
									options={this.optionsRoles}
									value={listRole}
								/>
							</Form.Item>

						</TabPane>
					</Tabs>
				</Form>
			</Card >
		);
	}
}

