import { action, observable } from 'mobx';
import http from '@services/httpService';
import { StatisticStorageMVPService, StatisticBillingOfMachineDto, ThongKeKhoNhieuMayDto, StatisticImportOfMachineDto, StatisticBillingOfProductDto,  StatisticBillingOfPaymentDto,  StatisticBillingOfProductWithMachineDto,  SORT, ThongKeHangHoaKho1MayDto, ThongKeHangHoaKhoNhieuMayDto, ThongKeNuotTienDto, ThongKeTongQuanDoanhSoTheoMayDto, ThongKeTongQuanDoanhSoTheoLoaiHinhThanhToanDto, ThongKeTongQuanDoanhSoTheoSanPhamDto, ThongKeTongQuanDoanhSoTheoNhomMayDto } from '@services/services_autogen';
export class SearchInputUser {
	public dr_type;
	public low_price;
	public high_price;
	public start_date;
	public end_date;
	public gr_ma_id;
	public ma_id_list;
	public fieldSort;
	public sort;
	public skipCount;
	public maxResult;
	constructor(dr_type, low_price, high_price, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult) {
		this.dr_type = dr_type;
		this.low_price = low_price;
		this.high_price = high_price;
		this.fieldSort = fieldSort;
		this.sort = sort;
		this.start_date = start_date;
		this.end_date = end_date;
		this.gr_ma_id = gr_ma_id;
		this.ma_id_list = ma_id_list;
		this.skipCount = skipCount;
		this.maxResult = maxResult;
	}
}
export class SearchInputSwallow {
	public start_date;
	public end_date;
	public gr_ma_id;
	public ma_id_list;
	public fieldSort;
	public sort;
	public skipCount;
	public maxResult;
	constructor(start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult) {
		this.fieldSort = fieldSort;
		this.sort = sort;
		this.start_date = start_date;
		this.end_date = end_date;
		this.gr_ma_id = gr_ma_id;
		this.ma_id_list = ma_id_list;
		this.skipCount = skipCount;
		this.maxResult = maxResult;
	}
}

export class SearchInputSellStatistic {
	public start_date;
	public end_date;
	public ma_id_list;
	public gr_ma_id;
	public fieldSort;
	public sort;
	constructor(start_date, end_date, ma_id_list, gr_ma_id, fieldSort, sort) {
		this.start_date = start_date;
		this.end_date = end_date;
		this.ma_id_list = ma_id_list;
		this.gr_ma_id = gr_ma_id;
		this.fieldSort = fieldSort;
		this.sort = sort;
	}
}
export class SearchInputAdmin extends SearchInputUser {
	public us_id;

	constructor(dr_type, low_price, high_price, us_id, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult) {
		super(dr_type, low_price, high_price, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult);
		this.us_id = us_id;
	}
}
export class SearchPriceUnitInput extends SearchInputUser {
	constructor(dr_type, low_price, high_price, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult) {
		super(dr_type, low_price, high_price, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult);
	}
}
export class SearchPriceUnitInputAdmin extends SearchPriceUnitInput {
	public us_id;
	constructor(dr_type, us_id, low_price, high_price, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult) {
		super(dr_type, low_price, high_price, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult);
		this.us_id = us_id;
	}
}
export class SearchBillingOfProductWithMachine extends SearchInputUser {
	public product_key;
	constructor(dr_type, low_price, high_price, product_key, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult) {
		super(dr_type, low_price, high_price, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult);
		this.product_key = product_key;
	}
}
export class SearchBillingOfProductWithMachineAdmin extends SearchBillingOfProductWithMachine {
	public us_id;
	constructor(dr_type, us_id, low_price, high_price, product_key, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult) {
		super(dr_type, low_price, high_price, product_key, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult);
		this.us_id = us_id;
	}
}
export class SearchStatisticImportSellRemainProductByAdmin extends SearchBillingOfProductWithMachine {
	public us_id;
	constructor(dr_type, us_id, low_price, high_price, product_key, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult) {
		super(dr_type, low_price, high_price, product_key, start_date, end_date, gr_ma_id, ma_id_list, fieldSort, sort, skipCount, maxResult);
		this.us_id = us_id;
	}
}

export class StatisticStore {
	private statisticStorageMVPService: StatisticStorageMVPService;
	@observable billingStatisticListResult: StatisticBillingOfMachineDto[] = [];
	@observable importingStatisticListResult: StatisticImportOfMachineDto[] = [];
	@observable listBillingOfDrinkProduct: StatisticBillingOfProductDto[] = [];
	@observable totalBillingStatistic: number = 0;
	@observable totalStatisticSwallow: number = 0;
	@observable statisticRespositoryListResult: ThongKeHangHoaKho1MayDto[] = [];
	@observable thongKeKhoNhieuMayDto: ThongKeKhoNhieuMayDto = new ThongKeKhoNhieuMayDto();
	@observable StatisticSalesOverviewOfGroupMachineListResult: ThongKeTongQuanDoanhSoTheoNhomMayDto[] = [];
	@observable StatisticSalesOverviewOfMachineListResult: ThongKeTongQuanDoanhSoTheoMayDto[] = [];
	@observable StatisticSalesOverviewOfProductListResult: ThongKeTongQuanDoanhSoTheoSanPhamDto[] = [];
	@observable StatisticSalesOverviewOfPaymentListResult: ThongKeTongQuanDoanhSoTheoLoaiHinhThanhToanDto[] = [];
	@observable StatisticSwallowListResult: ThongKeNuotTienDto[] = [];

	constructor() {
		this.statisticStorageMVPService = new StatisticStorageMVPService("", http);
	}
	@action
	public statisticBillingOfMachine = async (body: SearchInputUser) => {
		this.billingStatisticListResult = [];
		let result = await this.statisticStorageMVPService.statisticBillingOfMachine(body.dr_type, body.start_date, body.end_date, body.gr_ma_id, body.ma_id_list, body.fieldSort, body.sort, body.skipCount, body.maxResult);
		if (result != undefined && result.items != undefined && result.items != null) {
			this.billingStatisticListResult = result.items;
			this.totalBillingStatistic = result.totalCount;
		}
	}
	@action
	public statisticBillingOfMachinebyAdmin = async (body: SearchInputUser) => {
		this.billingStatisticListResult = [];
		let result = await this.statisticStorageMVPService.statisticBillingOfMachineByAdmin(undefined, body.dr_type, body.start_date, body.end_date, body.gr_ma_id, body.ma_id_list, body.fieldSort, body.sort, body.skipCount, body.maxResult);
		if (result != undefined && result.items != undefined && result.items != null) {
			this.billingStatisticListResult = result.items;
			this.totalBillingStatistic = result.totalCount;
		}
	}
	// Thống kê tiền nuốt:
	@action
	public statisticSwallowByAdmin = async (body: SearchInputSwallow) => {
		this.StatisticSwallowListResult = [];
		let result = await this.statisticStorageMVPService.thongKeNuotTien(body.start_date, body.end_date, body.gr_ma_id, body.ma_id_list, body.fieldSort, body.sort, body.skipCount, body.maxResult);
		if (result != undefined && result.items != undefined && result.items != null) {
			this.StatisticSwallowListResult = result.items;
			this.totalStatisticSwallow = result.totalCount;
		}
	}
	@action
	public statisticImportingOfMachine = async (body: SearchInputUser) => {
		this.importingStatisticListResult = [];
		let result = await this.statisticStorageMVPService.statisticImportOfMachine(body.start_date, body.end_date, body.gr_ma_id, body.ma_id_list, body.fieldSort, body.sort, body.skipCount, body.maxResult);
		if (result != undefined && result.items != undefined && result.items != null) {
			this.importingStatisticListResult = result.items;
		}
	}
	@action
	public statisticImportOfMachineByAdmin = async (body: SearchInputAdmin) => {
		this.importingStatisticListResult = [];
		let result = await this.statisticStorageMVPService.statisticImportOfMachineByAdmin(body.us_id, body.start_date, body.end_date, body.gr_ma_id, body.ma_id_list, body.fieldSort, body.sort, body.skipCount, body.maxResult);
		if (result != undefined && result.items != undefined && result.items != null) {
			this.importingStatisticListResult = result.items;
		}
	}
	@action
	public thongKeHangHoaKho1May = async (start_date: Date | undefined, end_date: Date | undefined, re_id: number | undefined, fieldSort: string | undefined, sort: SORT | undefined) => {
		this.statisticRespositoryListResult = [];
		let result = await this.statisticStorageMVPService.thongKeHangHoaKho1May(start_date, end_date, re_id, fieldSort, sort)
		if (result != undefined && result.items != undefined && result.items != null) {
			this.statisticRespositoryListResult = result.items;
		}
	}
	@action
	public thongKeHangHoaKhoNhieuMay = async (start_date: Date | undefined, end_date: Date | undefined, re_id: number | undefined, fieldSort: string | undefined, sort: SORT | undefined) => {
		this.thongKeKhoNhieuMayDto=new ThongKeKhoNhieuMayDto();
		let result = await this.statisticStorageMVPService.thongKeHangHoaKhoNhieuMay(start_date, end_date, re_id, fieldSort, sort)
		if (result != undefined && result.thongKeHangHoaKhoNhieuMayDto != undefined && result.thongKeHangHoaKhoNhieuMayDto != null) {
			this.thongKeKhoNhieuMayDto = result;
		}
	}

	// Báo cáo tổng quan doanh thu:
	@action
	public thongKeTongQuanDoanhSoTheoNhomMay = async (body: SearchInputSellStatistic) => {
		this.StatisticSalesOverviewOfGroupMachineListResult = [];
		let result = await this.statisticStorageMVPService.thongKeTongQuanDoanhSoTheoNhomMay(body.gr_ma_id, body.start_date, body.end_date, body.ma_id_list, body.fieldSort, body.sort)
		if (result != undefined && result.items != undefined && result.items != null) {
			this.StatisticSalesOverviewOfGroupMachineListResult = result.items;
		}
	}
	@action
	public thongKeTongQuanDoanhSoTheoMay = async (body: SearchInputSellStatistic) => {
		this.StatisticSalesOverviewOfMachineListResult = [];
		let result = await this.statisticStorageMVPService.thongKeTongQuanDoanhSoTheoMay(body.gr_ma_id, body.start_date, body.end_date, body.ma_id_list, body.fieldSort, body.sort)
		if (result != undefined && result.items != undefined && result.items != null) {
			this.StatisticSalesOverviewOfMachineListResult = result.items;
		}
	}
	@action thongKeTongQuanDoanhSoTheoSanPham = async (body: SearchInputSellStatistic) => {
		this.StatisticSalesOverviewOfProductListResult = [];
		let result = await this.statisticStorageMVPService.thongKeTongQuanDoanhSoTheoSanPham(body.gr_ma_id, body.start_date, body.end_date, body.ma_id_list, body.fieldSort, body.sort)
		if (result != undefined && result.items != undefined && result.items != null) {
			this.StatisticSalesOverviewOfProductListResult = result.items;
		}
	}
	@action
	public thongKeTongQuanDoanhSoTheoLoaiHinhThanhToan = async (body: SearchInputSellStatistic) => {
		this.StatisticSalesOverviewOfPaymentListResult = [];
		let result = await this.statisticStorageMVPService.thongKeTongQuanDoanhSoTheoLoaiHinhThanhToan(body.gr_ma_id, body.start_date, body.end_date, body.ma_id_list, body.fieldSort, body.sort)
		if (result != undefined && result.items != undefined && result.items != null) {
			this.StatisticSalesOverviewOfPaymentListResult = result.items;
		}
	}

	//báo cáo sản phẩm có bao bì người dùng
	@action
	public statisticBillingOfDrinkProduct = async (body: SearchPriceUnitInput) => {
		this.listBillingOfDrinkProduct = [];
		let result = await this.statisticStorageMVPService.statisticBillingOfDrinkProduct(body.low_price, body.high_price, body.start_date, body.end_date, body.gr_ma_id, body.ma_id_list, body.fieldSort, body.sort, body.skipCount, body.maxResult);
		if (result != undefined && result.items != undefined && result.items != null) {
			this.listBillingOfDrinkProduct = result.items;
			this.totalBillingStatistic = result.totalCount;
		}
	}
	//báo cáo sản phẩm có bao bì admin
	@action
	public statisticBillingOfDrinkProductByAdmin = async (body: SearchPriceUnitInputAdmin) => {
		this.listBillingOfDrinkProduct = [];
		let result = await this.statisticStorageMVPService.statisticBillingOfDrinkProductByAdmin(body.us_id, body.low_price, body.high_price, body.start_date, body.end_date, body.gr_ma_id, body.ma_id_list, body.fieldSort, body.sort, body.skipCount, body.maxResult);
		if (result != undefined && result.items != undefined && result.items != null) {
			this.listBillingOfDrinkProduct = result.items;
			this.totalBillingStatistic = result.totalCount;
		}
	}
	
	@action
	public statisticBillingOfQuyTieuDungXanh = async () => {
		let result = await this.statisticStorageMVPService.statisticBillingOfQuyTieuDungXanh();
		return result['result'];
	}
}


export default StatisticStore;