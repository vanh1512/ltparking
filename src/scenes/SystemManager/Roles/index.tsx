import * as React from 'react';
import { Button, Card, Col, Input, Modal, Row, Skeleton, Table, message, Space } from 'antd';
import CreateOrUpdateRole from './components/FormCreateOrUpdateRole';
import { L } from '@lib/abpUtility';
import { DeleteFilled, EditOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { pageSizeOptions, RouterPath } from '@lib/appconst';
import { stores } from '@stores/storeInitializer';
import { TablePaginationConfig } from 'antd/lib/table';
import { RoleDto } from '@src/services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import HistoryHelper from '@src/lib/historyHelper';
import PassWordLevel2 from '../Users/components/PassWordLevel2';
import PassWord from '../Users/components/PassWord';
import rules from '@src/components/Validation';

const confirm = Modal.confirm;

export default class Role extends AppComponentBase {
	state = {
		isLoadDone: false,
		modalCreateUpdate: false,
		modalChangePassWord: false,
		pageSize: AppConsts.PAGESIZE,
		skipCount: 0,
		currentPage: 1,
		roleId: 0,
		filter: '',
		visiblePassWordModalOpen: false,
		isCheckPassword2: false,
		hasPasswordLever2: false,
	};
	roleSelected: RoleDto = new RoleDto();

	async componentDidMount() {
		const sessionData = await stores.sessionStore.currentLogin
		this.setState({ hasPasswordLever2: sessionData.user.hasPassword2 })
		await this.setState({ isCheckPassword2: true, visiblePassWordModalOpen: true });
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.roleStore.getAll(this.state.filter, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true, modalCreateUpdate: false, modalChangePassWord: false });
	}

	handleTableChange = (pagination: TablePaginationConfig) => {
		this.setState({ skipCount: (pagination.current! - 1) * this.state.pageSize! }, async () => await this.getAll());
	};

	delete = (item: RoleDto) => {
		let self = this;
		confirm({
			title: (L('thong_bao')),
			content:
				<span>{L("cac_ban_co_muon_xoa_vai_tro")}<b>{item.displayName}</b>?</span>,
			async onOk() {
				self.setState({ isLoadDone: false });
				await stores.roleStore.delete(item.id);
				await self.getAll();
				message.success(L("xoa_thanh_cong"));
				self.setState({ isLoadDone: true });
			},
			onCancel() {
			},
		});
	}

	createOrUpdateModalOpen = async (inputRole: RoleDto) => {
		if (inputRole !== undefined && inputRole !== null) {
			await this.setState({ isLoadDone: false });
			this.roleSelected = inputRole;
			await this.setState({ isLoadDone: true, modalCreateUpdate: true, modalChangePassWord: false });
		}
	}
	async changePassWordModalOpen(inputRole: RoleDto) {
		this.roleSelected = inputRole;
		await this.setState({ modalChangePassWord: true, modalCreateUpdate: false });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, 10);
	};

	onChangePage = async (page: number, pageSize?: number) => {
		if (pageSize !== undefined) {
			await this.setState({ pageSize: pageSize });
		}
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page, pageSize: this.state.pageSize });
		await this.getAll()
	};


	onsavePassWord = async (val: boolean) => {
		if (val != undefined && val == true) {
			this.setState({ filter: undefined })
			await this.getAll();
			this.setState({ checkModal: true, visiblePassWordModalOpen: false });
		} else {
			Modal.error({ title: L("thong_bao"), content: L("khong_duoc_truy_cap") });
			HistoryHelper.redirect(RouterPath.admin_home);
		}
	}

	onCancelUsersPassWord = () => {
		this.setState({ visiblePassWordModalOpen: false });
		if (this.state.isCheckPassword2 == true) {
			HistoryHelper.redirect(RouterPath.admin_home);
		}
	}
	public render() {

		const left = this.state.modalCreateUpdate ? AppConsts.cssPanel(12) : AppConsts.cssPanel(24);
		const right = this.state.modalCreateUpdate ? AppConsts.cssPanel(12) : AppConsts.cssPanel(0);
		const { roles } = stores.roleStore;
		const columns: any = [
			{ title: L('stt'), dataIndex: 'userName', key: 'userName', width: 50, render: (text: string, item, index: number) => <div>{this.state.pageSize! * (this.state.currentPage! - 1) + (index + 1)}</div> },
			{ title: L("ten_hien_thi"), dataIndex: 'displayName', key: 'displayName', width: 150, 
				rules: [rules.required, rules.noSpaces],
				render: (text: string) => <div>{text}</div> },
			{ title: L("ten_vai_tro"), dataIndex: 'name', key: 'name', width: 150, 
				rules: [rules.required, rules.noSpaces],
				render: (text: string) => <div>{text}</div> },
		];
		if (this.isGranted(AppConsts.Permission.Pages_Manager_System_Roles_Edit) || this.isGranted(AppConsts.Permission.Pages_Manager_System_Roles_Delete)) {
			columns.push({
				title: L('chuc_nang'),
				width: 150,
				render: (text: string, item: RoleDto) => (
					<Space>
						{this.isGranted(AppConsts.Permission.Pages_Manager_System_Roles_Edit) &&
							<Button
								type="primary" icon={<EditOutlined />}
								title={L('chinh_sua')}
								size="small"
								onClick={() => this.createOrUpdateModalOpen(item)}>
							</Button>
						}
						{this.isGranted(AppConsts.Permission.Pages_Manager_System_Roles_Delete) &&
							<Button
								danger icon={<DeleteFilled />}
								title={L('xoa')}
								size="small"
								onClick={() => this.delete(item)}>
							</Button>
						}
					</Space>
				),
			})
		}
		return (
			<>
				<Skeleton active loading={this.state.visiblePassWordModalOpen}>
					<Card>
						<Row gutter={8}>
							<Col span={5}>
								<h2>{L('vai_tro')}</h2>
							</Col>
							<Col span={5}>
								<Input
									allowClear
									onPressEnter={() => this.handleSubmitSearch()}
									value={this.state.filter}
									placeholder={L("nhap_tim_kiem")}
									onChange={(e) => { this.setState({ filter: e.target.value }); this.handleSubmitSearch() }}
								/>
							</Col>
							<Col span={5}>
								<Button type='primary' icon={<SearchOutlined />} onClick={this.handleSubmitSearch}>{L("tim_kiem")}</Button>
							</Col>
							{this.isGranted(AppConsts.Permission.Pages_Manager_System_Roles_Create) &&
								<Col span={9} style={{ textAlign: "right" }}>
									<Button type="primary" title={L('them_moi')} onClick={() => this.createOrUpdateModalOpen(new RoleDto())} >{L('them_moi')}</Button>
								</Col>
							}
						</Row>
						<Row style={{ marginTop: 20 }}>
							<Col {...left} style={{ overflow: 'auto', maxHeight: "60vh" }}>
								<Table
									size="small"
									rowKey="id"
									onRow={(record) => {
										return {
											onDoubleClick: () => {
												{
													this.isGranted(AppConsts.Permission.Pages_Manager_System_Roles_Edit) &&
														this.createOrUpdateModalOpen(record!)
												}
											}
										};
									}}
									className='centerTable'
									bordered={true}
									rowClassName={(record) => (this.roleSelected.id == record.id ? 'bg-click' : 'bg-white')}
									pagination={{
										position: ['topRight'],
										pageSize: this.state.pageSize,
										total: roles === undefined ? 0 : roles.totalCount,
										defaultCurrent: 1,
										current: this.state.currentPage,
										showTotal: (total) => (L("tong")  + ": ") + AppConsts.formatNumber(total),
										showQuickJumper: true,
										showSizeChanger: true,
										onChange: this.onChangePage,
										onShowSizeChange: this.onChangePage,
										pageSizeOptions: pageSizeOptions,
									}} columns={columns}
									loading={roles === undefined ? true : false}
									dataSource={roles === undefined ? [] : roles.items}
									onChange={this.handleTableChange}
								/>
							</Col>
							<Col {...right}>
								{this.state.modalCreateUpdate &&
									<CreateOrUpdateRole
										onCancel={() =>
											this.setState({ modalCreateUpdate: false, })
										}
										onCreateOrUpdatedSuccess={() => { this.getAll() }}
										roleSelected={this.roleSelected}
									/>}
							</Col>
						</Row>
					</Card>
				</Skeleton>
				<Modal
					title={this.state.hasPasswordLever2 ? L("mat_khau_cap_2"): L("mat_khau")}
					visible={this.state.visiblePassWordModalOpen}
					onCancel={() => this.onCancelUsersPassWord()}
					cancelText={L("huy")}
					footer={null}
					className="UsersPassWordLevel2ModalClass"
					destroyOnClose={true}
					width={"50vw"}
				>
					{
						this.state.hasPasswordLever2
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
								isCheckPassword2={this.state.isCheckPassword2}
							/>
					}
				</Modal>
			</>
		);
	}
}

