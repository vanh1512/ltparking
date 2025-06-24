import { action, observable } from 'mobx';
import http from '@services/httpService';
import { DailyMonitoringService, MachineOutOfStockQueryDto, MachineDto, MachineNetworkStatus, SORT, MachineStatus, ProductDailyMonitoringDto } from '@services/services_autogen';
export class DailyMonitorStore {
	private dailyMonitoringService: DailyMonitoringService;
	@observable listMachineOutOfStockQueryDto: MachineOutOfStockQueryDto[] = [];
	@observable listMachineDto: MachineDto[] = [];
	@observable total: number = 0;

	constructor() {
		this.dailyMonitoringService = new DailyMonitoringService("", http);
	}

	
	@action
	public machineOutOfStockQuery = async (gr_ma_id: number | undefined, ma_id_list: number[] | undefined,fieldSort: string | undefined, sort: SORT | undefined, skipCount: number | undefined, maxResultCount: number | undefined,) => {
		this.listMachineOutOfStockQueryDto = [];
		let result = await this.dailyMonitoringService.machineOutOfStockQuery(gr_ma_id, ma_id_list,fieldSort, sort, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined) {
			this.total = result.totalCount;
			this.listMachineOutOfStockQueryDto = result.items;
		}
	}
	@action
	public machineOutOfStockQueryAdmin = async (us_id: number[] | undefined, gr_ma_id: number | undefined, ma_id_list: number[] | undefined,fieldSort: string | undefined, sort: SORT | undefined, skipCount: number | undefined, maxResultCount: number | undefined,) => {
		this.listMachineOutOfStockQueryDto = [];
		let result = await this.dailyMonitoringService.machineOutOfStockQueryAdmin(us_id, gr_ma_id, ma_id_list,fieldSort, sort, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined) {
			this.total = result.totalCount;
			this.listMachineOutOfStockQueryDto = result.items;
		}

	}
	
	@action
	public getAllMachineDetailOfListID = async (ma_id: number | undefined, listIdMachineDetail: number[] | undefined ) => {

		let listResult:ProductDailyMonitoringDto[] = [] ;
		let result = await this.dailyMonitoringService.getAllMachineDetailOfListID(ma_id,listIdMachineDetail);
		if (result != undefined && result.items != undefined) {
			this.total = result.totalCount;
			listResult= result.items!;
		}
		return listResult;
	}
	
	@action
	public statusMonitoring = async (ma_networkStatus: MachineNetworkStatus | undefined, ma_status: MachineStatus | undefined, fieldSort: string | undefined, sort: SORT | undefined, gr_ma_id: number | undefined, ma_id_list: number[] | undefined, skipCount: number | undefined, maxResultCount: number | undefined,) => {
		let result = await this.dailyMonitoringService.statusMonitoring(ma_networkStatus, ma_status, fieldSort, sort, gr_ma_id, ma_id_list, skipCount, maxResultCount);
		if (!!result) {
			this.total = result.totalCount;
			this.listMachineDto = result.items!
		}
		return this.listMachineDto
	}
	@action
	public statusMonitoringAdmin = async (us_id: number[] | undefined, ma_networkStatus: MachineNetworkStatus | undefined, ma_status: MachineStatus | undefined, fieldSort: string | undefined, sort: SORT | undefined, gr_ma_id: number | undefined, ma_id_list: number[] | undefined, skipCount: number | undefined, maxResultCount: number | undefined,) => {
		this.listMachineDto=[];
		let result = await this.dailyMonitoringService.statusMonitoringAdmin(us_id, ma_networkStatus, ma_status, fieldSort, sort, gr_ma_id, ma_id_list, skipCount, maxResultCount);
		if (!!result) {
			this.total = result.totalCount;
			this.listMachineDto = result.items!
		}
		return this.listMachineDto
	}
}
export default DailyMonitorStore;