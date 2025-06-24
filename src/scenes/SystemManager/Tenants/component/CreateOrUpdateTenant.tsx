import { CreateTenantDto, TenantDto, VCBInformationPayment, MoMoInformationPayment, VNPayInformationPayment } from '@src/services/services_autogen';
import * as React from 'react';
import { stores } from "@src/stores/storeInitializer";
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Space, message } from 'antd';
import AppConsts from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { FormInstance } from 'antd/lib/form';
import { L } from '@lib/abpUtility';
import rules from '@src/components/Validation';


export interface IProps {
	onCreateUpdateSuccess?: () => void;
	onCancel: () => void;
	tenantSelected: TenantDto;
	tenantId: number;
}
export default class CreateOrUpdateTenant extends AppComponentBase<IProps> {
	private formRef: React.RefObject<FormInstance<any>> = React.createRef();
	private formVCBPaymentRef: React.RefObject<FormInstance<any>> = React.createRef();
	private formMoMoPaymentRef: React.RefObject<FormInstance<any>> = React.createRef();
	private formVNPayPaymentRef: React.RefObject<FormInstance<any>> = React.createRef();
	state = {
		isLoadDone: false,
		isActive: false,
		isVisibleVCBInfo: false,
		isVisibleMoMoInfo: false,
		isVisibleVNPayInfo: false,
	}
	tenantSelected: TenantDto;

	componentDidMount() {
		this.initData(this.props.tenantSelected);
	}

	async componentDidUpdate(prevProps: IProps) {
		if (this.props.tenantId !== prevProps.tenantId) {
			this.initData(this.props.tenantSelected);
		}
	}

	initData = async (tenantInput: TenantDto | undefined) => {
		await this.setState({
			isVisibleVCBInfo: !!this.props.tenantSelected.vCBInformationPayment?.merchant_site_code,
			isVisibleMoMoInfo: !!this.props.tenantSelected.mOMOInformationPayment?.partnerCode,
			isVisibleVNPayInfo: !!this.props.tenantSelected.vnPayInformationPayment?.appId,
			isActive: !!this.props.tenantSelected?.isActive
		});
		if (tenantInput !== undefined && tenantInput.id !== undefined) {
			this.tenantSelected = tenantInput;
			this.formRef.current?.setFieldsValue(tenantInput);
			this.formVCBPaymentRef.current?.setFieldsValue(this.props.tenantSelected.vCBInformationPayment);
			this.formMoMoPaymentRef.current?.setFieldsValue(this.props.tenantSelected.mOMOInformationPayment);
			this.formVNPayPaymentRef.current?.setFieldsValue(this.props.tenantSelected.vnPayInformationPayment);
		} else {
			this.tenantSelected = new TenantDto();
			this.formRef.current!.resetFields();
			this.formVCBPaymentRef.current?.resetFields();
			this.formMoMoPaymentRef.current?.resetFields();
			this.formVNPayPaymentRef.current?.resetFields();
		}
		this.setState({ isLoadDone: !this.state.isLoadDone });
	}
	onCreateUpdate = async () => {
		const { tenantSelected } = this.props;
		let vCBPayment = new VCBInformationPayment();
		let mOMOPayment = new MoMoInformationPayment();
		let vNPayPayment = new VNPayInformationPayment();

		this.formVCBPaymentRef.current?.validateFields().then(async (values) => {
			vCBPayment.init({
				merchant_site_code: values?.merchant_site_code,
				buyer_fullname: values?.buyer_fullname,
				buyer_email: values?.buyer_email,
				buyer_mobile: values?.buyer_mobile,
			});
		})

		this.formMoMoPaymentRef.current?.validateFields().then(async (values) => {
			mOMOPayment.init({
				partnerCode: values?.partnerCode,
				accessKey: values?.accessKey,
				secretKey: values?.secretKey,
			});
		})

		this.formVNPayPaymentRef.current?.validateFields().then(async (values) => {
			vNPayPayment.init({
				appId: values?.appId,
				secretKey: values?.secretKey,
				secretKeyCheckout: values?.secretKeyCheckout,
				secretKeyIPN: values?.secretKeyIPN
			});
		})

		this.formRef.current?.validateFields().then(async (values: any) => {
			if (tenantSelected.id === undefined || tenantSelected.id < 0) {
				let tenantData = new CreateTenantDto({
					...values,
					isActive: this.state.isActive,
					connectionString: "",
					vCBInformationPayment: vCBPayment,
					mOMOInformationPayment: mOMOPayment,
					vnPayInformationPayment: vNPayPayment
				});
				await stores.tenantStore.create(tenantData);
				message.success(L("them_moi_thanh_cong"));
			} else {
				let tenantData = new TenantDto({
					id: tenantSelected.id,
					...values,
					isActive: this.state.isActive,
					vCBInformationPayment: vCBPayment,
					mOMOInformationPayment: mOMOPayment,
					vnPayInformationPayment: vNPayPayment
				});
				await stores.tenantStore.update(tenantData);
				message.success(L("chinh_sua_thanh_cong"));
			}
		})
		await stores.sessionStore.getCurrentLoginInformations();
		await this.onCreateUpdateSuccess();
		this.setState({ isLoadDone: !this.state.isLoadDone });
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	};

	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess();
		}
	}

	render() {
		const { tenantSelected } = this.props;
		const { tenant } = stores.sessionStore.currentLogin;
		return (
			<Card>
				<Row gutter={[8, 8]}>
					<Col span={12}>
						<h3>
							{this.props.tenantId
								? L("thong_tin")+ tenantSelected.tenancyName
								: L("them_moi_tenant")}
						</h3>
					</Col>
					<Col span={12} style={{ textAlign: "right" }}>
						<Space>
							<Button danger onClick={() => this.onCancel()}>{L('huy')}</Button>
							<Button type="primary" onClick={() => this.onCreateUpdate()}>{L('luu')}</Button>
						</Space>
					</Col>
				</Row>
				<Form
					ref={this.formRef}
					style={{ width: '100%' }}
					className="tenant-form"
				>
					<Form.Item label={L("ten")} {...AppConsts.formItemLayoutTitleSmall} name={"name"} rules={[rules.required, rules.noAllSpaces]}>
						<Input placeholder='Name...' allowClear></Input>
					</Form.Item>
					<Form.Item label={L("ten_tenancy")} {...AppConsts.formItemLayoutTitleSmall} name={"tenancyName"} rules={[rules.required, rules.noAllSpaces]}>
						<Input placeholder='tenancyName...' allowClear></Input>
					</Form.Item>
					{!this.props.tenantId &&
						<Form.Item label={L("dia_chi_email_admin")} {...AppConsts.formItemLayoutTitleSmall} name={"adminEmailAddress"} rules={[rules.required, rules.noAllSpaces]}>
							<Input placeholder='adminEmailAddress...' allowClear></Input>
						</Form.Item>
					}
					<Form.Item label={L("hoat_dong")} {...AppConsts.formItemLayoutTitleSmall} >
						<Checkbox onChange={async e => await this.setState({ isActive: e.target.checked })} checked={this.state.isActive}></Checkbox>
					</Form.Item>
					<Form.Item label={L("so_may_toi_da")} rules={[rules.required]} {...AppConsts.formItemLayoutTitleSmall} name='maxNumberOfMachine'>
						<InputNumber max={50} min={1} maxLength={2} onChange={(e) => this.formRef.current?.setFieldsValue({ maxNumberOfMachine: e })}></InputNumber>
					</Form.Item>
					{!tenant &&
						<>
							<Form.Item label={<span className={`tenant-form__bank-span ${this.state.isVisibleVCBInfo && '--payment-checkbox-checked'}`}>Vietcombank</span>} {...AppConsts.formItemLayoutTitleSmall}>
								<Checkbox
									className={`${this.state.isVisibleVCBInfo && 'tenant-form__payment-checkbox -margin-top'}`}
									onChange={(e) => {
										this.setState({ isVisibleVCBInfo: e.target.checked }, () => {
											if (e.target.checked) {
												this.formVCBPaymentRef.current?.setFieldsValue(this.props.tenantSelected.vCBInformationPayment);
											} else {
												this.formVCBPaymentRef.current?.resetFields();
											}
										});
									}}
									checked={this.state.isVisibleVCBInfo}>
								</Checkbox>
								{this.state.isVisibleVCBInfo &&
									<Form ref={this.formVCBPaymentRef} className={'tenant-form__payment-form'}>
										<Form.Item label="merchant_site_code" {...AppConsts.formItemLayout} name={"merchant_site_code"} rules={[rules.required, rules.noAllSpaces]}>
											<Input placeholder='merchant_site_code...' />
										</Form.Item>
										<Form.Item label="buyer_fullname" {...AppConsts.formItemLayout} name={"buyer_fullname"} rules={[rules.required, rules.noAllSpaces]}>
											<Input placeholder='buyer_fullname...' allowClear />
										</Form.Item>
										<Form.Item label="buyer_email" {...AppConsts.formItemLayout} name={"buyer_email"} rules={[rules.required, rules.noAllSpaces, rules.emailAddress]}>
											<Input placeholder='buyer_email...' allowClear />
										</Form.Item>
										<Form.Item label="buyer_mobile" {...AppConsts.formItemLayout} name={"buyer_mobile"} rules={[rules.required, rules.noAllSpaces, rules.phone]}>
											<Input placeholder='buyer_mobile...' allowClear />
										</Form.Item>
									</Form>
								}
							</Form.Item>
							<Form.Item label={<span className={`tenant-form__bank-span ${this.state.isVisibleMoMoInfo && '--payment-checkbox-checked'}`}>{L("vi_momo")}</span>} {...AppConsts.formItemLayoutTitleSmall}>
								<Checkbox
									className={`${this.state.isVisibleMoMoInfo && 'tenant-form__payment-checkbox -margin-top'}`}
									onChange={(e) => {
										this.setState({ isVisibleMoMoInfo: e.target.checked }, () => {
											if (e.target.checked) {
												this.formMoMoPaymentRef.current?.setFieldsValue(this.props.tenantSelected.mOMOInformationPayment);
											} else {
												this.formMoMoPaymentRef.current?.resetFields();
											}
										});
									}}
									checked={this.state.isVisibleMoMoInfo}>
								</Checkbox>
								{this.state.isVisibleMoMoInfo &&
									<Form ref={this.formMoMoPaymentRef} className={'tenant-form__payment-form'}>
										<Form.Item label="partnerCode" {...AppConsts.formItemLayout} name={"partnerCode"} rules={[rules.required, rules.noAllSpaces]}>
											<Input placeholder='partnerCode...' allowClear />
										</Form.Item>
										<Form.Item label="accessKey" {...AppConsts.formItemLayout} name={"accessKey"} rules={[rules.required, rules.noAllSpaces]}>
											<Input placeholder='accessKey...' />
										</Form.Item>
										<Form.Item label="secretKey" {...AppConsts.formItemLayout} name={"secretKey"} rules={[rules.required, rules.noAllSpaces]}>
											<Input placeholder='secretKey...' allowClear />
										</Form.Item>
									</Form>
								}
							</Form.Item>
							<Form.Item label={<span className={`tenant-form__bank-span ${this.state.isVisibleVNPayInfo && '--payment-checkbox-checked'}`}>{L("vi_VNPay")}</span>} {...AppConsts.formItemLayoutTitleSmall}>
								<Checkbox
									className={`${this.state.isVisibleVNPayInfo && 'tenant-form__payment-checkbox -margin-top'}`}
									onChange={(e) => {
										this.setState({ isVisibleVNPayInfo: e.target.checked }, () => {
											if (e.target.checked) {
												this.formVNPayPaymentRef.current?.setFieldsValue(this.props.tenantSelected.vnPayInformationPayment);
											} else {
												this.formVNPayPaymentRef.current?.resetFields();
											}
										});
									}}
									checked={this.state.isVisibleVNPayInfo}>
								</Checkbox>
								{this.state.isVisibleVNPayInfo &&
									<Form ref={this.formVNPayPaymentRef} className={'tenant-form__payment-form'}>
										<Form.Item label="appId" {...AppConsts.formItemLayout} name={"appId"} rules={[rules.required, rules.noAllSpaces]}>
											<Input placeholder='appId...' allowClear />
										</Form.Item>
										<Form.Item label="secretKey" {...AppConsts.formItemLayout} name={"secretKey"} rules={[rules.required, rules.noAllSpaces]}>
											<Input placeholder='secretKey...' />
										</Form.Item>
										<Form.Item label="secretKeyCheckout" {...AppConsts.formItemLayout} name={"secretKeyCheckout"} rules={[rules.required, rules.noAllSpaces]}>
											<Input placeholder='secretKeyCheckout...' />
										</Form.Item>
										<Form.Item label="secretKeyIPN" {...AppConsts.formItemLayout} name={"secretKeyIPN"} rules={[rules.required, rules.noAllSpaces]}>
											<Input placeholder='secretKeyIPN...' />
										</Form.Item>
									</Form>
								}
							</Form.Item>
						</>
					}
				</Form>
			</Card >
		)
	}
}