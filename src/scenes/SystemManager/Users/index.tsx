import { DeleteFilled, DeleteOutlined, EditOutlined, LockOutlined, LogoutOutlined, SearchOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons';
import PasswordChanging from '@components/PasswordChange';
import { L } from '@lib/abpUtility';
import AppConsts, { pageSizeOptions, RouterPath } from '@lib/appconst';
import HistoryHelper from '@lib/historyHelper';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { Int64EntityDto, UserDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { Button, Card, Col, Input, Modal, Row, Skeleton, Space, Switch, Table, message } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import CreateOrUpdateUser from './components/FormCreateOrUpdateUser';
import PassWordLevel2 from './components/PassWordLevel2';
import './index.css';
import * as React from 'react';
import PassWord from './components/PassWord';
import debounce from "lodash.debounce";

const confirm = Modal.confirm;

export default class User extends AppComponentBase {
	debouncedSearch: () => void;
	constructor(props) {
		super(props);
		this.debouncedSearch = debounce(this.handleSubmitSearch, 500);
	}
	state = {
		isLoadDone: false,
		modalCreateUpdate: false,
		modalChangePassWord: false,
		pageSize: AppConsts.PAGESIZE,
		skipCount: 0,
		currentPage: 1,
		userId: 0,
		filter: '',
		isActive: undefined,
		visiblePassWordModalOpen: true,
		isCheckPassword2: false,
		checkModal: false,
		hasPasswordLever2: false,
		checkTitle: false,
	};
	userSelected: UserDto = new UserDto();

	async componentDidMount() {
		this.handleClearSearch();
		const sessionData = await stores.sessionStore.currentLogin
		this.setState({ hasPasswordLever2: sessionData.user.hasPassword2 })
		await this.setState({ isCheckPassword2: true, visiblePassWordModalOpen: true });
	}
	checkTurnOfModal = async (input: boolean) => {
		await this.setState({ checkModal: input })
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.userStore.getAll(this.state.filter, this.state.isActive, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true });
	}

	handleTableChange = (pagination: TablePaginationConfig) => {
		this.setState({ skipCount: (pagination.current! - 1) * this.state.pageSize! }, async () => await this.getAll());
	};

	async activateOrDeActive(checked: boolean, id: number) {
		this.setState({ isLoadDone: false });
		let item_id = new Int64EntityDto();
		item_id.id = id;
		if (checked) {
			await stores.userStore.activate(item_id);
			message.success(L("bat_thanh_cong"));
		} else {
			await stores.userStore.deActivate(item_id);
			message.success(L("tat_thanh_cong"));
		}
		await this.getAll();
		this.setState({ isLoadDone: true });
	}

	delete = (id: number) => {
		let self = this;
		confirm({
			title: L("ban_muon_xoa_nguoi_dung_nay"),
			async onOk() {
				self.setState({ isLoadDone: false });
				await stores.userStore.deleteUser(id);
				self.setState({ isLoadDone: true, modalCreateUpdate: false, });
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	async createOrUpdateModalOpen(inputUser: UserDto) {
		await this.setState({ isLoadDone: false })
		this.userSelected = inputUser;
		await this.setState({ isLoadDone: true, modalChangePassWord: false, modalCreateUpdate: true });
	}
	async changePassWordModalOpen(inputUser: UserDto) {
		this.userSelected = inputUser;
		await this.setState({ modalCreateUpdate: false, modalChangePassWord: true });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	};

	handleClearSearch = async () => {
		await this.setState({
			isActive: undefined,
			filter: undefined
		})
		this.onChangePage(1, this.state.pageSize);
	}

	openModalPassWordLevel2 = async (isCheckPassword2: boolean) => {
		this.setState({
			isCheckPassword2: isCheckPassword2,
			visiblePassWordModalOpen: !this.state.visiblePassWordModalOpen,
		});
	};

	onsavePassWord = async (val: boolean) => {
		if (val != undefined && val == true) {
			await this.setState({ checkModal: true, visiblePassWordModalOpen: false })
			await this.getAll();
			this.setState({ checkTitle: true })
		} else {
			Modal.error({ title: L("thong_bao"), content: L("khong_duoc_truy_cap")});
			HistoryHelper.redirect(RouterPath.admin_home);
		}
	}

	onCancelUsersPassWord = () => {
		this.setState({ visiblePassWordModalOpen: false });
		if (this.state.isCheckPassword2 == true) {
			HistoryHelper.redirect(RouterPath.admin_home);
		}
	}

	onChangePage = async (page: number, pageSize?: number) => {
		if (pageSize !== undefined) {
			await this.setState({ pageSize: pageSize });
		}
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page, pageSize: this.state.pageSize });
		await this.getAll();
	};
	onRedirect = () => {
		HistoryHelper.redirect(RouterPath.admin_home);
	}
	loginUser = async (user: UserDto) => {
		confirm({
			title:L("ban_muon_dang_nhap_vao_tai_khoan_nguoi_dung_nay_khong"),
			async onOk() {
				//await stores.authenticationStore.adminLoginUserWithoutPassword(user.id);
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}
	searchKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ filter: e.target.value })
		this.debouncedSearch();
	}
	public render() {
		const left = this.state.modalChangePassWord || this.state.modalCreateUpdate ? AppConsts.cssRightMain.left : AppConsts.cssPanelMain.left;
		const right = this.state.modalChangePassWord || this.state.modalCreateUpdate ? AppConsts.cssPanelMain.right : AppConsts.cssRightMain.right;
		const { users, totalUser } = stores.userStore;
		const columns: any = [
			{ title: L('stt'), dataIndex: 'userName', key: 'userName', width: 50, render: (text: string, item, index: number) => <div>{this.state.pageSize! * (this.state.currentPage! - 1) + (index + 1)}</div> },
			...(!stores.sessionStore.getTenant() ? [
				{
					title: L('Tenant Name'),
					dataIndex: 'tenantName',
					key: 'tenantName',
					render: (text: string, item: UserDto) => <div>{item.tenantName}</div>,
				}
			] : []),
			{ title: L('ten_dang_nhap'), dataIndex: 'userName', key: 'userName', render: (text: string) => <div>{text}</div> },
			{ title: L("ho_ten"), dataIndex: 'fullName', key: 'fullName', render: (text: string) => <div>{text}</div> },
			{ title: L('email'), dataIndex: 'emailAddress', key: 'emailAddress', render: (text: string) => <div>{text}</div> },
			{ title:L("quyen"), dataIndex: 'roleNames', key: 'roleNames', render: (text: string[]) => <div>{text.join(', ')}</div> },
			{
				title: L('kich_hoat'), dataIndex: 'isActive', key: 'isActive',
				render: (text: string, item: UserDto) => <Switch checked={item.isActive} onClick={(checked: boolean) => this.activateOrDeActive(checked, item.id)}></Switch>
			},
			{
				title: L('chuc_nang'), fixed: 'right',
				render: (text: string, item: UserDto) => (
					<Space>
						{this.isGranted(AppConsts.Permission.Pages_Manager_System_Users_Edit) &&
							<Button
								size='small'
								type="primary" icon={<EditOutlined />}
								title={L("chinh_sua")}
								onClick={() => this.createOrUpdateModalOpen(item!)}
							></Button>
						}
						<Button
							type="primary"
							icon={<LockOutlined />}
							size='small'
							title={L("doi_mat_khau")}
							onClick={() => this.changePassWordModalOpen(item!)}
						></Button>

						{this.isGranted(AppConsts.Permission.Pages_Manager_System_Users_Delete) &&
							<Button
								size='small'
								danger icon={<DeleteFilled />}
								title={L("xoa")}
								onClick={() => this.delete(item.id!)}
							></Button>
						}
						{this.isGranted(AppConsts.Permission.Pages_Manager_System_Tenants) &&
							<Button
								size='small'
								icon={<LogoutOutlined />}
								title={L("dang_nhap_nguoi_dung")}
								onClick={() => this.loginUser(item)}
							></Button>
						}
					</Space>
				),
			},
		];

		return (
			<>
				<Skeleton active loading={this.state.visiblePassWordModalOpen}>
					<Card onClick={this.state.checkModal == false ? this.onRedirect : undefined}>
						<Row>
							<Col span={4}><h2 >{L("nguoi_dung")}</h2></Col>
							<Col span={12}>
								<Row gutter={8}>
									<Col span={6}>
										<Input onPressEnter={() => this.handleSubmitSearch()} value={this.state.filter} allowClear onChange={async (e) => this.searchKeyword(e)} placeholder={L("ten_dang_nhap,ho_ten,email")} />
									</Col>
									
								</Row>
							</Col>
							<Col span={8} style={{ textAlign: "right" }}>
								<Space>
									{this.isGranted(AppConsts.Permission.Pages_Manager_System_Users_Create) &&
										<Button type="primary" title={L("them_nguoi_dung_moi")} icon={<UserAddOutlined />} onClick={() => this.createOrUpdateModalOpen(new UserDto())} >{L("them_nguoi_dung_moi")									}</Button>
									}
									<Button type="primary" icon={<SettingOutlined />} title={L("cai_dat_mat_khau_cap_2")} onClick={() => this.openModalPassWordLevel2(false)}>{L("cai_dat_mat_khau_cap_2")}</Button>
								</Space>
							</Col>
						</Row>
						<Row style={{ marginTop: 20 }}>
							<Col {...left}>
								<Table
									scroll={{ x: 1000 }}
									rowKey={(record) => record.id!.toString()}
									onRow={(record) => {
										return {
											onDoubleClick: () => { this.createOrUpdateModalOpen(record!) }
										};
									}}
									className='centerTable'
									size={'small'}
									bordered={true}
									rowClassName={(record) => (this.userSelected.id == record.id ? 'bg-click' : 'bg-white')}
									columns={columns}
									pagination={{
										position: ['topRight'],
										pageSize: this.state.pageSize,
										total: users === undefined ? 0 : totalUser,
										defaultCurrent: 1,
										current: this.state.currentPage,
										showTotal: (total) => L("tong")+ AppConsts.formatNumber(total),
										showQuickJumper: true,
										showSizeChanger: true,
										onChange: this.onChangePage,
										onShowSizeChange: this.onChangePage,
										pageSizeOptions: pageSizeOptions,
									}}
									dataSource={users}
									onChange={this.handleTableChange}
								/>
							</Col>
							<Col {...right}>
								{this.state.modalCreateUpdate &&
									<CreateOrUpdateUser
										userListResult={users}
										onCancel={() => {
											this.setState({ modalCreateUpdate: false, });
										}}
										onCreateOrUpdatedSuccess={async () => { await this.getAll(); this.setState({ modalCreateUpdate: false }) }}
										userSelected={this.userSelected}
									/>
								}
								{this.state.modalChangePassWord &&
									<PasswordChanging
										onClose={() => this.setState({ modalChangePassWord: false })}
										userSelected={this.userSelected}
									/>
								}
							</Col>
						</Row>
					</Card>
				</Skeleton>
				<Modal
					title={this.state.hasPasswordLever2 ? L("mat_khau_cap_2"): this.state.checkTitle == true ? L("thay_doi_mat_khau_cap_2"): L("mat_khau_tai_khoan")}
					visible={this.state.visiblePassWordModalOpen}
					onCancel={() => this.onCancelUsersPassWord()}
					cancelText={L("huy")}
					footer={null}
					className="UsersPassWordLevel2ModalClass"
					destroyOnClose={true}
					width={"50vw"}
				>
					{this.state.hasPasswordLever2
						?
						<PassWordLevel2
							oncancel={() => this.setState({ visiblePassWordModalOpen: false })}
							onsave={this.onsavePassWord}
							isCheckPassword2={this.state.isCheckPassword2}
						/>
						:
						<PassWord
							oncancel={() => this.setState({ visiblePassWordModalOpen: false })}
							onsave={this.onsavePassWord}
							checkTitle={this.state.checkTitle}
							isCheckPassword2={this.state.isCheckPassword2}
						/>
					}
				</Modal>
			</>
		);
	}
}
