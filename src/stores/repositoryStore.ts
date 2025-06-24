import http from '@services/httpService';
import { RepositoryDto, RepositoryService, CreateRepositoryInput, UpdateRepositoryInput, RepositoryDetailService, RepositoryDetailDto } from '@services/services_autogen';
import { message } from 'antd';
import { action, observable } from 'mobx';
import { L } from '@src/lib/abpUtility';

export class TreeRepositoryDto extends RepositoryDto {
	key: number;
	title: string;
	value: number;
	children: TreeRepositoryDto[] = [];
	nrchildren = () => {
		let total = this.children.length;
		this.children.forEach(element => {
			total += element.nrchildren();
		});
		return total;
	}
	constructor(data?: RepositoryDto) {
		super(data);
		this.key = this.re_id;
		this.title = this.re_name!;
		this.value = this.key!;
	}

}
export class RepositoryStore {
	private repositoryService: RepositoryService;
	private repositoryDetailService: RepositoryDetailService;

	@observable totalReponsitory: number = 0;
	@observable repositoryListResult: RepositoryDto[] = [];
	@observable repositoryDetailListResult: RepositoryDetailDto[] = [];
	@observable treeRepositoryDto: TreeRepositoryDto[] = [];

	constructor() {
		this.repositoryService = new RepositoryService("", http);
		this.repositoryDetailService = new RepositoryDetailService("", http);
	}

	@action
	public getAll = async () => {
		this.repositoryListResult = [];
		let result = await this.repositoryService.getAll();
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalReponsitory = result.totalCount;
			this.repositoryListResult = result.items;
			this.treeRepositoryDto = this.makeTree(this.repositoryListResult);
		}
	}
	@action
	private makeTree(list: RepositoryDto[]) {
		let allIds = list.map(item => item.re_id);
		// Tìm các nút gốc ảo (các re_parent_id không tồn tại trong allIds)
		let rootNodes = list.filter(item => !allIds.includes(item.re_parent_id));

		// Nếu không có nút gốc ảo, tìm các nút gốc thực (re_parent_id = null)
		if (rootNodes.length === 0) {
			rootNodes = list.filter(item => item.re_parent_id === null);
		}
		if (rootNodes.length === 0) {
			message.error(L("khong_co_du_lieu")
)
		}
		let forest:TreeRepositoryDto[] = [];
		for (let rootNode of rootNodes) {
			let treeRoot = new TreeRepositoryDto(rootNode);
			this.createCatTree(treeRoot, list);
			forest.push(treeRoot);
		}
		return forest;
	}

	private createCatTree(organizationParent: TreeRepositoryDto, list: RepositoryDto[]) {
		if (organizationParent === undefined) {
			return;
		}
		let listChild = list.filter(item => item.re_parent_id == organizationParent.re_id);
		let sortedListChild = listChild.sort((a, b) => a.re_id - b.re_id);
		for (let i = 0; i < sortedListChild.length; i += 1) {
			let item = listChild[i];
			let roots: TreeRepositoryDto = new TreeRepositoryDto(item);
			this.createCatTree(roots, list);
			organizationParent.children.push(roots);
		}
	}
	@action
	public createRepository = async (body: CreateRepositoryInput) => {
		let result = await this.repositoryService.createRepository(body);
		if (result == true) {
			return true;
		}
		else return false;
	}
	@action
	public deleteRepository = async (id: number) => {
		await this.repositoryService.delete(id);
	}
	@action
	public updateRepository = async (body: UpdateRepositoryInput) => {
		let result = await this.repositoryService.updateRepository(body);
		if (result == true) {
			return true;
		}
		else return false;
	}
	@action
	public getAllByAdmin = async (us_id_operator: number[] | undefined) => {
		this.repositoryListResult = [];
		let result = await this.repositoryService.getAllByAdmin(us_id_operator);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalReponsitory = result.totalCount;
			this.repositoryListResult = result.items;
			this.treeRepositoryDto = this.makeTree(this.repositoryListResult);
			
		}
	}
	@action
	public getAllRepositoryDetail = async (re_id: number | undefined) => {
		this.repositoryDetailListResult=[];
		if(re_id != undefined && re_id >0){
			let result = await this.repositoryDetailService.getAll(re_id);
			if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
				this.repositoryDetailListResult =  result.items;
			}
		}

		return this.repositoryDetailListResult;
	}
}


export default RepositoryStore;