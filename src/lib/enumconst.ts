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

export const eShiftStatus = {
	NONE: new MEnum(0, L("NONE")),
	YES: new MEnum(1, L("YES")),
	NO: new MEnum(2, L("NO")),

}
export const valueOfeShiftStatus = (val: number | undefined) => {
	return _getValue(Object.values(eShiftStatus), val, "name");
}

export const eAllowInOut = {
	NO: new MEnum(0, L("NO")),
	YES: new MEnum(1, L("YES")),

}
export const valueOfeAllowInOut = (val: number | undefined) => {
	return _getValue(Object.values(eAllowInOut), val, "name");
}
export const eEndShift = {
	NONE: new MEnum(0, L("NONE")),
	NO: new MEnum(1, L("NO")),
	YES: new MEnum(2, L("YES")),

}
export const valueOfeEndShift = (val: number | undefined) => {
	return _getValue(Object.values(eEndShift), val, "name");
}

export const eInOutStatus = {
	WAITIN: new MEnum(0, L("WAITIN")),
	WAITSETIMAGEIN: new MEnum(1, L("WAITSETIMAGEIN")),
	IN: new MEnum(2, L("IN")),
	WAITOUT: new MEnum(3, L("WAITOUT")),
	WAITSETIMAGEOUT: new MEnum(4, L("WAITSETIMAGEOUT")),
	OUT: new MEnum(5, L("OUT")),
}
export const valueOfeInOutStatus = (val: number | undefined) => {
	return _getValue(Object.values(eInOutStatus), val, "name");
}
