import { L } from './abpUtility';

export class MEnum {
	num: number;
	name: string;
	color: string;
	icon: any;
	constructor(num: number | 0, name: string | "", color?: string, icon?: any) {
		this.num = num;
		this.name = name;
		this.color = color || "green";
		this.icon = icon || "";
	}
}
const _getValue = (enu: MEnum[], val: number | undefined, col: "name" | "color" | "icon"): string => {
	if (val !== undefined) {
		let item = enu.find(item => item.num == val);
		if (item !== undefined) {
			return L(item[col]);
		}
	}
	return "";
}



//---------------------------------------------------------------------------------------------------------

export const eBillStatus = {
	CREATE: new MEnum(0, L("khoi_tao")),
	PAYMENT: new MEnum(1, L("dang_giao_dich")),
	SUCCESS: new MEnum(2, L("thanh_cong")),

}
export const valueOfeBillStatus = (val: number | undefined) => {
	return _getValue(Object.values(eBillStatus), val, "name");
}

export const eTypeFile = {
	IMAGE: new MEnum(0, "IMAGE"),
	PDF: new MEnum(1, "PDF"),
	NONE: new MEnum(2, "NONE"),
}
export const valueOfeTypeFile = (val: number | undefined) => {
	return _getValue(Object.values(eTypeFile), val, "name");
}
//---------------------------------------------------------------------------------------------------------

export const eGENDER = {
	FEMALE: new MEnum(0, L("nu")),
	MALE: new MEnum(1, L("nam_gioitinh")),
	OTHER: new MEnum(2, L("khac")),
}
export const valueOfeGENDER = (val: number | undefined) => {
	return _getValue(Object.values(eGENDER), val, "name");
}
//---------------------------------------------------------------------------------------------------------


export const eDrinkType = {
	Do_dong_chai: new MEnum(0, L("san_pham_co_bao_bi")),
	Do_tuoi: new MEnum(1, L("san_pham_khong_co_bao_bi")),
}
export const valueOfeDrinkType = (val: number | undefined) => {
	return _getValue(Object.values(eDrinkType), val, "name");
}
//----------------------------------------------------------------------------------------------------------
export const eRefundType = {
	TIEN_MAT: new MEnum(0, L("tien_mat")),
	MA_QR: new MEnum(1, L("ngan_hang")),
}
export const eBillMethod = {
	TIEN_MAT: new MEnum(0, L("tien_mat")),
	MA_QR: new MEnum(1, L("ngan_hang")),
	RFID: new MEnum(2, L('rfid')),
	VNPAYQR: new MEnum(3, L("vi_VNPay")),
	MOMO: new MEnum(4, L('vi_momo')),
	PROMO: new MEnum(5, L('khuyen_mai')),
}
export const valueOfeBillMethod = (val: number | undefined) => {
	return _getValue(Object.values(eBillMethod), val, "name");
}
//----------------------------------------------------------------------------------------------------------
export const eMoney = {
	KHONG: new MEnum(0, "0 VNĐ"),
	MOT_CHUC: new MEnum(10000, "10,000 VNĐ"),
	HAI_CHUC: new MEnum(20000, "20,000 VNĐ"),
	NAM_CHUC: new MEnum(50000, "50,000 VNĐ"),
}
export const valueOfeMoney = (val: number | undefined) => {
	return _getValue(Object.values(eMoney), val, "name");
}

export const eReportStatus = {
	KHOI_TAO: new MEnum(0, L("khoi_tao")),
	DA_HOAN_THANH: new MEnum(2, L('da_xu_ly')),
}
export const valueOfeReportStatus = (val: number | undefined) => {
	return _getValue(Object.values(eReportStatus), val, "name");
}

export const eRepositoryType = {
	KHO_CAP_PHAT: new MEnum(1, L("kho_cap_phat")),
	KHO_NHAN_HANG: new MEnum(2, L("kho_nhan")),
}
export const valueOfeRepositoryType = (val: number | undefined) => {
	return _getValue(Object.values(eRepositoryType), val, "name");
}

export const eReportLevel = {
	CANH_BAO: new MEnum(0, L('canh_bao')),
	LOI: new MEnum(1, L("co_loi")),
}
export const valueOfeReportLevel = (val: number | undefined) => {
	return _getValue(Object.values(eReportLevel), val, "name");
}

export const ePaymentStatus = {
	Create: new MEnum(0, L("khoi_tao"), "#FFB266"),
	Success: new MEnum(1, L("thanh_cong"), "green"),
	ErrorQR: new MEnum(2, L("sai_ma_qr"), "red"),
	Error: new MEnum(3, L("loi"), "orange"),
}
export const colorOfePaymentStatus = (val: number | undefined) => {
	return _getValue(Object.values(ePaymentStatus), val, "color");
}
export const valueOfePaymentStatus = (val: number | undefined) => {
	return _getValue(Object.values(ePaymentStatus), val, "name");
}
export const eBank = {
	VCB: new MEnum(1, "VCB"),
	MOMO: new MEnum(2, "MOMO"),
	VNPay: new MEnum(3, "VNPay"),

}
export const valueOfeBank = (val: number | undefined) => {
	return _getValue(Object.values(eBank), val, "name");
}
export const eRIFDAction = {
	ADD_MONEY: new MEnum(0, L("nap_tien")),
	CHANGE_STATUS: new MEnum(1, L('thay_doi_trang_thai')),
	BUY: new MEnum(2, L('giao_dich')),
	CREATE: new MEnum(3, L('tao_moi')),
	CHANGE_MONEY: new MEnum(4, L('doi_tien')),
	CHANGE_MONEY_SALE: new MEnum(5, L("doi_tien_khuyen_mai")),
	ADD_POINT: new MEnum(6, L("cong_diem_quy_doi")),
	DELETE: new MEnum(7, L("xoa_the")),
}
export const valueOfeRIFDAction = (val: number | undefined) => {
	return _getValue(Object.values(eRIFDAction), val, "name");
}
export const eActive = {
	Inactive: new MEnum(0, L("chua_kich_hoat")),
	Active: new MEnum(1, L("kich_hoat")),
}
export const valueOfeActive = (val: number | undefined) => {
	return _getValue(Object.values(eActive), val, "name");
}
export const eSort = {
	ASC: new MEnum(1, L("dang_tang_dan")),
	DES: new MEnum(2, L("dang_giam_dan")),
}
export const valueOfeDocumentSort = (val: number | undefined) => {
	return _getValue(Object.values(eSort), val, "name");
}
export const eMachineNetworkStatus = {
	OFFLINE: new MEnum(1, L("ngoai_tuyen")),
	ONLINE: new MEnum(2, L("truc_tuyen")),
	Warning: new MEnum(3, L("canh_bao")),
}
export const valueOfeMachineNetworkStatus = (val: number | undefined) => {
	return _getValue(Object.values(eMachineNetworkStatus), val, "name");
}
export const eMachineStatusMonitor = {
	ABNORMAL: new MEnum(0, L("bat_thuong")),
	NORMAL: new MEnum(1, L("binh_thuong")),
}
export const valueOfeMachineStatusMonitor = (val: number | undefined) => {
	return _getValue(Object.values(eMachineStatusMonitor), val, "name");
}
export const eWithdrawStatus = {
	CREATING: new MEnum(0, L("khoi_tao")),
	ACCEPTED: new MEnum(1, L("chap_thuan")),
	GIVEBACK: new MEnum(2, L("tra_ve")),
	RECEIVED: new MEnum(3, L("da_nhan_tien")),


}
export const valueOfeWithdrawStatus = (val: number | undefined) => {
	return _getValue(Object.values(eWithdrawStatus), val, "name");
}
export const eRFIDTypeRecharge = {
	RechargeMoney: new MEnum(0, L("nap_tien")),
	ChangeMoney: new MEnum(1, L("doi_tien")),
	ChangeSaleMoney: new MEnum(2, L("doi_tien_khuyen_mai")),
}
export const valueOfeRFIDTypeRecharge = (val: number | undefined) => {
	return _getValue(Object.values(eRFIDTypeRecharge), val, "name");
}

export const eRefundReasonType = {
	REMAIN_CASH: new MEnum(0, L("nguoi_dung_con_du_tien")),
	QR_ERROR: new MEnum(1, L("qr_thanh_cong_va_may_khong_nhan_tien")),
	PAID_ERROR: new MEnum(2, L("nha_hang_loi")),
}
export const valueOfeRefundReasonType = (val: number | undefined) => {
	return _getValue(Object.values(eRefundReasonType), val, "name");
}
export const eFileType = {
	NONE: new MEnum(0, L("khong")),
	PRODUCT_IMAGE: new MEnum(1, L("anh_san_pham")),
	APK: new MEnum(2, L("apk")),
	AVATAR: new MEnum(3, L("anh_dai_dien")),
}
export const valueOfeFileType = (val: number) => {
	return _getValue(Object.values(eFileType), val, "name");
}
export const eRefundStatus = {
	NOTREFUND: new MEnum(0, L("chua_hoan_tien")),
	ERROR: new MEnum(1, L("khong_hop_le")),
	REFUNDED: new MEnum(2, L("da_hoan_tien"))
}
export const valueOfeRefundStatus = (val: number | undefined) => {
	return _getValue(Object.values(eRefundStatus), val, "name");
}
export const eReconsile = {
	CASH: new MEnum(0, L("tien_mat")),
	QR: new MEnum(1, L("ngan_hang")),
	RFID: new MEnum(2, L("rfid")),
}

export const valueOfeReconsile = (val: number) => {
	return _getValue(Object.values(eReconsile), val, "name");
}
export const eReconcileWithdrawStatus = {
	NONE: new MEnum(0, L("cho_khach_xac_nhan_doi_soat")),
	READY: new MEnum(1, L("san_sang_va_dang_cho_rut")),
	PAID: new MEnum(2, L("da_rut")),

}
export const valueOfeReconcileWithdrawStatus = (val: number) => {
	return _getValue(Object.values(eReconcileWithdrawStatus), val, "name");
}
export const eReconcileBillingStatus = {
	NONE: new MEnum(0, L("dang_cho_xac_nhan_doi_soat")),
	PAYING: new MEnum(1, L("dang_thanh_toan")),
	PAID: new MEnum(2, L("da_thanh_toan")),

}
export const valueOfeReconcileBillingStatus = (val: number) => {
	return _getValue(Object.values(eReconcileBillingStatus), val, "name");
}
export const eBillReconcileStatus = {
	NONE: new MEnum(0, L("chua_doi_soat")),
	ERROR: new MEnum(1, L("da_doi_soat_va_phat_hien_loi")),
	DOING: new MEnum(2, L("da_soi_soat_va_phat_hien_loi")),
	DONE: new MEnum(3, L("doi_soat_thanh_cong")),
}

export const valueOfeBillReconcileStatus = (val: number) => {
	return _getValue(Object.values(eBillReconcileStatus), val, "name");
}
export const eReconcileStatus = {
	NONE: new MEnum(0, L("cho_xac_nhan_doi_soat")),
	READY: new MEnum(1, L("da_xac_nhan_va_co_the_rut_tien")),
	PAYMENT_ONEPART: new MEnum(2, L("thanh_toan_1_phan")),
	PAYMENT_COMPLETE: new MEnum(3, L("da_thanh_toan")),
	PAID: new MEnum(4, L("da_rut_tien")),
}

export const valueOfeReconcileStatus = (val: number) => {
	return _getValue(Object.values(eReconcileStatus), val, "name");
}
export const eBillRequiredFund = {
	NONE: new MEnum(0, L("khong_co_yeu_cau_hoan_tra")),
	REQUEST_REFUND: new MEnum(1, L("co_yeu_cau_hoan_tra")),
	REFUNDED: new MEnum(2, L("da_hoan_tra")),
}
export const valueOfeBillRequiredFund = (val: number) => {
	return _getValue(Object.values(eBillRequiredFund), val, "name");
}

export const eBillReconcileExcel = {
	BOTH: new MEnum(0, L("co_o_ca_2")),
	EXCEL: new MEnum(1, L("chi_co_o_excel")),
	WEB: new MEnum(2, L("chi_co_o_web")),
}
export const eComponentUpload = {
	NONE: new MEnum(0, L("cac_loai_file_khac")),
	PRODUCT_IMAGE: new MEnum(1, L("anh_san_pham")),
	APK: new MEnum(2, L("apk")),
	AVATAR: new MEnum(2, L("anh_dai_dien")),
}
export const valueOfeComponentUpload = (val: number) => {
	return _getValue(Object.values(eComponentUpload), val, "name");
}
export const eMainBoard = {
	TCNSTANDJS: new MEnum(0, "TCNSTANDJS"),
	VSI_ICI: new MEnum(1, "VSI_ICI"),
	DIGITAL_SCALE: new MEnum(2, "DIGITAL_SCALE"),
	ONLY_REFILL: new MEnum(3, "ONLY_REFILL"),
	VNU: new MEnum(4, "VNU"),
	ALL_IN_ONE: new MEnum(5, "ALL_IN_ONE"),
	NONE: new MEnum(6, ""),
}

export const valueOfeMainBoard = (val: number) => {
	return _getValue(Object.values(eMainBoard), val, "name");
}

export const ePaidStatus = {
	CREATE: new MEnum(0, L("qua_trinh_tao_don_hang")),
	ERROR: new MEnum(1, L("loi")),
	PART_SUCCESS: new MEnum(2, L("tra_hang_thanh_cong_1_phan")),
	SUCCESS: new MEnum(3, L("tra_hang_thanh_cong")),
}
export const valueOfePaidStatus = (val: number) => {
	return _getValue(Object.values(ePaidStatus), val, "name");
}
export const eReconcileLogType = {
	BILLING: new MEnum(0, L("lich_su_doi_soat_cua_hoa_don")),
	EXCEL: new MEnum(1, L("lich_su_doi_soat_cua_excel")),
}
export const valueOfeReconcileLogType = (val: number) => {
	return _getValue(Object.values(eReconcileLogType), val, "name");
}
export const eRepositoryProductStatus = {
	AVAILABLE: new MEnum(0, L("hang_con_trong_kho")),
	ALMOST_OUT_OF_STOCK: new MEnum(1, L("sap_het_hang")),
	OUT_OF_STOCK: new MEnum(2, L("het_hang")),
	LONG_TERM_INVENTORY: new MEnum(3, L("ton_kho_lau")),
}
export const valueOfeRepositoryProductStatus = (val: number) => {
	return _getValue(Object.values(eRepositoryProductStatus), val, "name");
}
export const eStatusProduct = {
	STOP_USE: new MEnum(0, L("ngung_kinh_doanh")),
	USE: new MEnum(1, L("dang_kinh_doanh")),

}
export const valueOfeStatusProduct = (val: number) => {
	return _getValue(Object.values(eStatusProduct), val, "name");
}
export const eRepositoryLogAction = {
	NONE: new MEnum(0, L("khong_co_hoat_dong")),
	IMPORT_GOODS: new MEnum(1, L("nhap_them_so_luong")),
	IMPORT_REPOSITORY: new MEnum(2, L("lay_tu_may_so_luong")),
	EXPORT_REPOSITORY: new MEnum(3, L("lay_so_luong")),

}
export const valueOfeRepositoryLogAction = (val: number) => {
	return _getValue(Object.values(eRepositoryLogAction), val, "name");
}
export const eHandoverStatus = {
	NONE: new MEnum(0, L("chua_ban_giao")),
	HANDOVER_ONEPART: new MEnum(1, L("ban_giao_1_phan")),
	HANDOVER_COMPLETE: new MEnum(2, L("hoan_thanh")),
}
export const valueOfeHandoverStatus = (val: number) => {
	return _getValue(Object.values(eHandoverStatus), val, "name");
}
export const eHandoverType = {
	NONE: new MEnum(0, L("chua_ban_giao")),
	HANDOVER_ONLYMACHINE: new MEnum(1, L("chi_ban_giao_may")),
	HANDOVER_ONLYPRODUCT: new MEnum(2, L("chi_ban_giao_hang")),
	HANDOVER_BOTH: new MEnum(3, L("ban_giao_may_va_hang")),
}
export const valueOfeHandoverType = (val: number) => {
	return _getValue(Object.values(eHandoverType), val, "name");
}
export const eKindOfDay = {
	HOM_NAY: new MEnum(1, L("hom_nay")),
	HOM_QUA: new MEnum(2, L("hom_qua")),
	BAY_NGAY_QUA: new MEnum(3, L("tuan_nay")),
	THANG_NAY: new MEnum(4, L("thang_nay")),
	THANG_TRUOC: new MEnum(5, L("thang_truoc")),
}
export const valueOfeKindOfDay = (val: number) => {
	return _getValue(Object.values(eKindOfDay), val, "name");
}
export const eStatusImportRepository = {
	PHIEU_TAM: new MEnum(0, L("phieu_tam")),
	DA_NHAP_KHO: new MEnum(1, L("da_nhap_kho")),

}
export const valueOfeStatusImportRepository = (val: number) => {
	return _getValue(Object.values(eStatusImportRepository), val, "name");
}
export const eReconcileType = {
	CASH: new MEnum(0, L("tien_mat")),
	QR: new MEnum(1, L("ngan_hang")),
	RFID: new MEnum(2, L("rfid")),
	DEBT: new MEnum(3, L("cong_no")),
}

export const valueOfeReconcileType = (val: number) => {
	return _getValue(Object.values(eReconcileType), val, "name");
}
export const eReconcileDebtStatus = {
	WAIT: new MEnum(0, L("cho_xac_nhan_doi_soat")),
	SUCCESS: new MEnum(1, L("da_xac_nhan")),
}
export const valueOfeReconcileDebtStatus = (val: number) => {
	return _getValue(Object.values(eReconcileDebtStatus), val, "name");
}
export const eReconcileDebtStatusSupplier = {

	WAIT: new MEnum(0, L("cho_xac_nhan_doi_soat")),
	SUCCESS: new MEnum(1, L("da_xac_nhan_va_co_the_thanh_toan")),
	PAYMENT_ONEPART: new MEnum(2, L("thanh_toan_1_phan")),
	PAYMENT_COMPLETE: new MEnum(3, L("da_thanh_toan")),
}
export const valueOfeReconcileDebtStatusSupplier = (val: number) => {
	return _getValue(Object.values(eReconcileDebtStatusSupplier), val, "name");
}
export const ePaymentDebt = {
	CASH: new MEnum(0, L("tien_mat")),
	QR: new MEnum(1, L("ngan_hang")),
}
export const valueOfePaymentDebt = (val: number) => {
	return _getValue(Object.values(ePaymentDebt), val, "name");
}
export const eSupplierPaymentStatus = {
	NOTPAID: new MEnum(0, L("chua_thanh_toan")),
	PAID_ONEPART: new MEnum(1, L("thanh_toan_1_phan")),
	PAID: new MEnum(2, L("da_thanh_toan")),
}
export const valueOfeSupplierPaymentStatus = (val: number) => {
	return _getValue(Object.values(eSupplierPaymentStatus), val, "name");
}
export const eTrashType = {
	NONE: new MEnum(0, L("chua_phan_loai")),
	RAC_GIAY: new MEnum(1, L("rac_giay")),
	NHUA_CUNG: new MEnum(2, L("nhua_cung")),
	LON_KIM_LOAI: new MEnum(3, L("lon_kim_loai")),
	NHUA_DEO: new MEnum(4, L("nhua_deo")),
	CHAI_NHUA: new MEnum(5, L("chai_nhua")),
	RAC_VAI: new MEnum(6, L("rac_vai")),
	RAC_THUYTINH: new MEnum(7, L("rac_thuy_tinh")),
	PIN_DIENTU: new MEnum(8, L("pin_dien_tu")),

}
export const valueOfeTrashType = (val: number) => {
	return _getValue(Object.values(eTrashType), val, "name");
}
export const eMachineSoftLogsStatus = {
	NOT_UPDATED: new MEnum(0, L('chua_cap_nhat')),
	UPDATED: new MEnum(1, L('da_cap_nhat')),
}
export const valueOfeMachineSoftLogsStatus = (val: number) => {
	return _getValue(Object.values(eMachineSoftLogsStatus), val, "name");
}
export const eTypeNotification = {
	TRANSACTION: new MEnum(0, L('giao_dich')),
	ERROR: new MEnum(1, L('loi')),
	REFUND: new MEnum(2, L('hoan_tien')),
	OTHER: new MEnum(3, L('khac')),
}
export const valueOfeTypeNotification = (val: number) => {
	return _getValue(Object.values(eTypeNotification), val, "name");
}
export const eAuthorizationMachineType = {
	OPERATOR: new MEnum(0, L("van_hanh")),
	MONITOR: new MEnum(1, L('giam_sat')),
}
export const valueOfeAuthorizationMachineType = (val: number) => {
	return _getValue(Object.values(eAuthorizationMachineType), val, "name");
}
export const eTranferRepositoryStatus = {
	TEMPORARY: new MEnum(0, L("phieu_tam")),// PHIẾU TẠM
	REQUEST: new MEnum(1, L("yeu_cau_nhap_hang")), // YÊU CẦU NHẬP HÀNG
	CONFIRM: new MEnum(2, L("xac_nhan_yeu_cau")), // XÁC NHẬN YÊU CẦU
	RECEIVED: new MEnum(3, L("da_nhan_hang")), // ĐÃ NHẬN HÀNG
	CANCEL_RECEIVE: new MEnum(4, L("huy_nhap_hang")), // HỦY NHẬP HÀNG
	CANCEL: new MEnum(5, L("huy_yeu_cau")), // HỦY YÊU CẦU
}
export const valueOfeTranferRepositoryStatus = (val: number) => {
	return _getValue(Object.values(eTranferRepositoryStatus), val, "name");
}

export const eTranferStatus = {
	ALL: new MEnum(0, L('tat_ca')),// PHIẾU TẠM
	RECEIVE: new MEnum(1, L('nhan_cap_phat')), // Nhận cấp phát
	TRANSFER: new MEnum(2, L('cap_nhat')), // Cấp phát
}
export const valueOfeTranferStatus = (val: number) => {
	return _getValue(Object.values(eTranferStatus), val, "name");
}

// // ValueOfLossRepository:
export const eLossRepositoryStatus = {
	TEMPORARY: new MEnum(0, L("phieu_tam")),// PHIẾU TẠM
	REQUIRED: new MEnum(1, L("yeu_cau_kiem_hang")), // YÊU CẦU KIỂM HÀNG
	APPROVED: new MEnum(2, L("xac_nhan_yeu_cau")), // XÁC NHẬN YÊU CẦU
	CANCEL: new MEnum(3, L("huy_yeu_cau")), // HỦY YÊU CẦU
}
export const valueOfLossRepositoryStatus = (val: number) => {
	return _getValue(Object.values(eLossRepositoryStatus), val, "name");
}
export const ePaymentMethod = {
	VCB: new MEnum(1, "Vietcombank"),
	MOMO: new MEnum(2, L('vi_momo')),
	VNPAY: new MEnum(3, L('vi_VNPay')),
}
export const valueOfePaymentMethod = (val: number) => {
	return _getValue(Object.values(ePaymentMethod), val, "name");
}
export const eKindofChart = {
	topProductOfMoneyAndQuantity: new MEnum(1, "topProductOfMoneyAndQuantity"),
	topRefundMoneyMachine: new MEnum(2, "topRefundMoneyMachine"),
}
export const valueOfeKindofChart = (val: number) => {
	return _getValue(Object.values(eKindofChart), val, "name");
}
export const eFormatPicker = {
	date: "date",
	month: "month",
	year: "year",
}

