import * as React from 'react';
import { ExportOutlined, PlusOutlined } from '@ant-design/icons';
import AppConsts, { EventTable, RouterPath, cssCol, cssColResponsiveSpan, pageSizeOptions } from '@src/lib/appconst';
import { TenantDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { Button, Card, Col, Modal, Row, Skeleton, message, Input } from 'antd';
import TenantTable from './component/TenantTable';
import CreateOrUpdateTenant from './component/CreateOrUpdateTenant';
import PassWordLevel2 from '../Users/components/PassWordLevel2';
import PassWord from '../Users/components/PassWord';
import HistoryHelper from '@src/lib/historyHelper';
import { L } from '@lib/abpUtility';
import debounce from "lodash.debounce";

const { confirm } = Modal;

export default class Tenant extends React.Component {
	debouncedSearch: () => void;
	constructor(props) {
		super(props);
		this.debouncedSearch = debounce(this.handleSubmitSearch, 500);
	}
	state = {
		isLoadDone: false,
		visibleModalCreateUpdate: false,
		visibleExportTenant: false,
		visibleModalImport: false,
		keyword: undefined,
		isActive: undefined,
		skipCount: 0,
		maxResultCount: 10,
		onChangePage: 1,
		currentPage: 1,
		pageSize: AppConsts.PAGESIZE,
		visiblePassWordModalOpen: false,
		isCheckPassword2: false,
		hasPasswordLever2: false,
	};

	tenantSelected: TenantDto = new TenantDto();

	async componentDidMount() {
		await this.getAll();
		const sessionData = await stores.sessionStore.currentLogin;
		this.setState({ hasPasswordLever2: sessionData.user.hasPassword2 })
		await this.setState({ isCheckPassword2: true, visiblePassWordModalOpen: true });
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.tenantStore.getAll(this.state.keyword, this.state.isActive, this.state.skipCount, this.state.maxResultCount);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelAuthor: false });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}
	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize !== undefined) {
			await this.setState({ pageSize: pagesize! });
		}
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		})
	}
	createOrUpdateModalOpen = async (input: TenantDto) => {
		if (input !== undefined && input !== null) {
			this.tenantSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, isLoadDone: true });
		}
	}
	actionTable = async (tenant: TenantDto, event: EventTable) => {
		let self = this;
		if (tenant === undefined || tenant.id === undefined) {
			message.error(L("khong_tim_thay"));
			return;
		}
		else if (event === EventTable.Delete) {
			confirm({
				title: L("ban_co_chac_muon_xoa")+ tenant.name + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					await stores.tenantStore.delete(tenant.id);
					await self.getAll();
					message.success(L("xoa_thanh_cong"))
					self.setState({ isLoadDone: true });
				},
				onCancel() {
				},
			});
		}
		else if (event === EventTable.Edit) {
			await this.tenantSelected.init(tenant);
			this.setState({ visibleModalCreateUpdate: true, isLoadDone: !this.state.isLoadDone });
		}
		else if (event === EventTable.Login) {
			confirm({
				title: L("ban_muon_dang_nhap_vao_tai_khoan_tenant_nay_khong"),
				async onOk() {
					//await stores.authenticationStore.adminLoginWithoutPassword(tenant.tenancyName, tenant.id);
					await self.setState({ isLoadDone: !self.state.isLoadDone });
				},
				onCancel() {
					console.log('Cancel');
				},
			});

		}
	};
	onCreateUpdateSuccess = () => {
		this.getAll();
		this.setState({ isLoadDone: !this.state.isLoadDone, visibleModalCreateUpdate: false, })
	}
	clearSearch = async () => {
		this.setState({ keyword: undefined });
		this.handleSubmitSearch();
	}
	shouldChangeText = () => {
		const isChangeText = window.innerWidth <= 768;
		return !isChangeText;
	}
	onCancelUsersPassWord = () => {
		this.setState({ visiblePassWordModalOpen: false });
		if (this.state.isCheckPassword2 == true) {
			HistoryHelper.redirect(RouterPath.admin_home);
		}
	}
	onsavePassWord = async (val: boolean) => {
		if (val != undefined && val == true) {
			this.setState({ filter: undefined })
			await this.getAll();
			this.setState({ visiblePassWordModalOpen: false });
		} else {
			Modal.error({ title: (L('thong_bao')), content: (L("khong_duoc_truy_cap")) });
			HistoryHelper.redirect(RouterPath.admin_home);
		}
	}
	searchTenantName = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ keyword: e.target.value })
		this.debouncedSearch();
	}
	render() {
		let self = this;
		const { tenants, totalCount } = stores.tenantStore;
		const left = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 12, 12, 12, 12) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 12, 12, 12, 12) : cssCol(0);
		return (
			<>
				<Skeleton active loading={this.state.visiblePassWordModalOpen}>
					<Card>
						<Row gutter={[8, 8]}>
							<Col {...cssColResponsiveSpan(24, 24, 6, 6, 6, 6)}>
								<h2>Tenants</h2>
							</Col>
							<Col {...cssColResponsiveSpan(24, 12, 6, 6, 6, 6)}>
								<Input placeholder={L("nhap_ten_ten_tenant")}
									onChange={this.searchTenantName}
									onPressEnter={this.handleSubmitSearch}
								></Input>
							</Col>
							<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)} style={{ display: "flex", flexWrap: "wrap", justifyContent: "end", gap: 8 }}>
								<Button title={L("them_moi")} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new TenantDto())}>{this.shouldChangeText() && L("them_moi")}</Button>
								<Button title={L("xuat_du_lieu")} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportTenant: true })}>{this.shouldChangeText() && L("xuat_du_lieu")}</Button>
							</Col>
						</Row>
						<Row>
							<Col {...left} style={{ overflowY: "auto" }}>
								<TenantTable
									actionTable={this.actionTable}
									hasAction={true}
									tenantListResult={tenants}
									pagination={{
										position: ['topRight'],
										pageSize: this.state.pageSize,
										total: totalCount,
										current: this.state.currentPage,
										showTotal: (tot) => L("tong") + ":" + tot + "",
										showQuickJumper: true,
										showSizeChanger: true,
										pageSizeOptions: pageSizeOptions,
										onShowSizeChange(current: number, size: number) {
											self.onChangePage(current, size)
										},
										onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
									}}
								/>
							</Col>
							<Col {...right}>
								<CreateOrUpdateTenant
									tenantSelected={this.tenantSelected}
									tenantId={this.tenantSelected.id}
									onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
									onCreateUpdateSuccess={this.onCreateUpdateSuccess}
								/>
							</Col>

						</Row>
					</Card>
					
				</Skeleton>
				<Modal
					title={this.state.hasPasswordLever2 ? L("mat_khau_cap_2"): L("mat_khau")}
					visible={this.state.visiblePassWordModalOpen}
					onCancel={() => this.onCancelUsersPassWord()}
					cancelText={L('huy')}
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
							isCheckPassword2={this.state.isCheckPassword2}
						/>
					}
				</Modal>
			</>
		)
	}
}