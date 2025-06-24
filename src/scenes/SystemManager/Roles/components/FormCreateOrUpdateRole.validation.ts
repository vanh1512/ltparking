import { L } from '@lib/abpUtility';
import { Rule } from 'antd/lib/form';

const rules = {
	name: [
		{ 
			required: true, 
			whitespace: true,
			message: L('khong_duoc_bo_trong') 
		}
	] as Rule[],
	displayName: [
		{ 
			required: true, 
			whitespace: true,
			message: L('khong_duoc_bo_trong') 
		} 
	] as Rule[],
};

export default rules;
