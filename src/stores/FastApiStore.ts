import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	FastAPIService,
	ReportTurnoverOfCurrentVehicleDto
} from '@services/services_autogen';
export class FastApiStore {

	private FastAPIService: FastAPIService;
	@observable totalCount: number = 0;
	@observable reportTurnoverOfCurrentVehicleDto: ReportTurnoverOfCurrentVehicleDto[] = [];
	constructor() {
		this.FastAPIService = new FastAPIService("", http);
	}

	@action
	public getTurnoverOfCurrentVehicle = async (fromDate: Date | undefined, toDate: Date | undefined, gateId: number[] | undefined,) => {
		let result = await this.FastAPIService.getTurnoverOfCurrentVehicle(fromDate, toDate, gateId);
		if (result && result.items) {
			this.reportTurnoverOfCurrentVehicleDto = result.items;
			this.totalCount = result.totalCount;
		}
	}
}
export default FastApiStore;
