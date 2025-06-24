import { LockOutlined } from '@ant-design/icons';
import { L } from '@lib/abpUtility';
import { AppConsts } from '@lib/appconst';
import HistoryHelper from '@lib/historyHelper';
import { ResetPasswordDto, UserDto } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import { Button, Card, Col, Input, Row, message } from 'antd';
import * as React from 'react';

export interface IProps {
	onClose: () => void;
	userSelected: UserDto;
}

export interface IState {
	password1: string;
	password2: string;
}

export default class PasswordChanging extends React.Component<IProps, IState> {
	state = {
		password1: "",
		password2: "",
	};

	onClose = () => {
		if (this.props.onClose !== undefined) {
			this.props.onClose();
		}
	}

	onSubmit = async () => {
		const { password1, password2 } = this.state;
		if (password1 === undefined || password1.length < 8) {
			message.error(L('mat_khau_phai_hon_8_ky_tu'));
			return;
		}
		if (password1 !== password2) {
			message.error(L('mat_khau_khong_khop'));
			return;
		}
		if (!AppConsts.formatPassword(password1)) {
			message.error(L('mat_khau_it_nhat_8_ky_tu_bao_gom_chu_thuong_chu_hoa_va_so'));
			return;
		}
		if (password1 != password2) {
			message.warning(L('mat_khau_khong_khop'));

		}
		else {
			let input = new ResetPasswordDto();
			input.userId = this.props.userSelected.id;
			input.newPassword = password1;
			await stores.userStore.resetPassword(input);
			message.success(L('doi_password_thanh_cong'));
			if (this.props.userSelected.id === -1) {
				HistoryHelper.redirect("/logout");
			}
			this.props.onClose();
		}

	}

	render() {
		const { password1, password2 } = this.state;
		const { userSelected } = this.props;

		return (
			<Card className="wrapper">
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{L('doi_mat_khau_nguoi_dung') + ": "}<strong>{userSelected.fullName}</strong></h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger onClick={this.onClose}>{L('huy')}</Button>
						&nbsp;&nbsp;
						<Button type="primary" onClick={this.onSubmit}>{L("xac_nhan")}</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10 }}>
					<Col span={8}>{L('mat_khau_moi')}:</Col>
					<Col span={16}>

						<Input.Password
							placeholder={L('mat_khau_moi')+'...'}
							value={password1}
							prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							size="large"
							onChange={(e) => this.setState({ password1: e.target.value })}
						/>
					</Col>
				</Row>
				<Row style={{ marginTop: 10 }}>
					<Col span={8}>{L('nhap_lai_mat_khau')}: </Col>
					<Col span={16}>
						<Input.Password
							placeholder={L('nhap_lai_mat_khau')+'...'}
							value={password2}
							prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							size="large"
							onChange={(e) => this.setState({ password2: e.target.value })}
						/>

					</Col>
				</Row>

			</Card>
		);
	}
}