import http from '@services/httpService';
import { eLossRepositoryStatus } from '@src/lib/enumconst';
import { LossRepositoryDto, LossRepositoryService, SORT, CreateLossRepositoryInput, UpdateLossRepositoryInput, ChangeStatusLossRepositoryInput, ProductAbstractDto, ELossRepositoryStatus } from '@src/services/services_autogen';
import { action, observable } from 'mobx';
export class LossRepositoryStore {
	private lossRepositoryService: LossRepositoryService;

	@observable totalLossReponsitory: number = 0;
	@observable lossRepositoryListResult: LossRepositoryDto[] = [];

	constructor() {
		this.lossRepositoryService = new LossRepositoryService("", http);
	}

	@action
	public getAllByAdmin = async (lo_re_code: string | undefined,us_id_import: number | undefined, re_id: number | undefined,lo_re_status: ELossRepositoryStatus | undefined, fieldSort: string | undefined, sort: SORT | undefined, skipCount: number | undefined, maxResultCount: number | undefined ) => {
		this.lossRepositoryListResult = [];
		let result = await this.lossRepositoryService.getAllByAdmin(lo_re_code,us_id_import,re_id,lo_re_status, fieldSort, sort, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalLossReponsitory = result.totalCount;
			this.lossRepositoryListResult = result.items;
		}
	}
	@action
	public getAll = async (lo_re_code: string | undefined,us_id_import: number | undefined, re_id: number | undefined,lo_re_status: ELossRepositoryStatus | undefined, fieldSort: string | undefined, sort: SORT | undefined, skipCount: number | undefined, maxResultCount: number | undefined ) => {
		this.lossRepositoryListResult = [];
		let result = await this.lossRepositoryService.getAll(lo_re_code,us_id_import,re_id,lo_re_status, fieldSort, sort, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalLossReponsitory = result.totalCount;
			this.lossRepositoryListResult = result.items;
		}
	}
	@action
	public getAllProductInRepository = async (re_id: number | undefined) => {
		var listProduct:ProductAbstractDto[] = [];
		let result = await this.lossRepositoryService.getAllProductInRepository(re_id);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			listProduct = result.items!;
		}
		return listProduct;
	}
	
	@action
	public updateLossRepository = async (input: UpdateLossRepositoryInput | undefined) => {
		let result = await this.lossRepositoryService.updateLossRepository(input);
		this.lossRepositoryListResult = this.lossRepositoryListResult!.map((x: LossRepositoryDto) =>
			x.lo_re_id === result!.lo_re_id ? result! : x
		);
	}
	// @action
	// public delete = async (im_re_id: number | undefined) => {
	// 	await this.importRepositoryService.delete(im_re_id);
	// }
	// @action
	// public deleteMulti = async (im_re_id: number[] | undefined) => {
	// 	await this.importRepositoryService.deleteMulti(im_re_id);
	// }
	@action
	public createLossRepository = async (input: CreateLossRepositoryInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<LossRepositoryDto>(<any>null);
		}
		let result: LossRepositoryDto = await this.lossRepositoryService.createLossRepository(input);
		if (!!result) {
			this.lossRepositoryListResult!.push(result);
		}
		else return false
	}
	
	@action
    public changeStatus = async (body: ChangeStatusLossRepositoryInput | undefined,) => {
        let result = await this.lossRepositoryService.changeStatus(body);
        if (result) {
            var transferRepository = this.lossRepositoryListResult.find(a => a.lo_re_id == body?.lo_re_id);
            if (transferRepository) {
                transferRepository.lo_re_status = body?.lo_re_status!;
            }
        }
    }
}


export default LossRepositoryStore;