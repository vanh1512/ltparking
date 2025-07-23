import * as React from 'react';
import { L, isGranted } from '@src/lib/abpUtility';
import { AppConsts } from '@src/lib/appconst';
import { message } from 'antd';
import moment, { Moment } from 'moment';
declare var abp: any;
declare var document: any;
class AppComponentBase<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
	L(key: string, sourceName?: string): string {
		return L(key);
	}

	isGranted(permissionName: string): boolean {
		return isGranted(permissionName);
	}
	getFile(fi_id: number) {
		let fi_id_modified = encodeURI(fi_id + "");
		return AppConsts.remoteServiceBaseUrl + "download/file?path=" + fi_id_modified;
	}
	folderLogcat(DevID: number) {
		let DevID_modified = encodeURI(DevID + "");
		return AppConsts.remoteServiceBaseUrl + "folderLogcat?DevID=" + DevID_modified;
	}
	zipImageProduct() {
		window.location.href = AppConsts.remoteServiceBaseUrl + "download/zipImageProduct";
	}
	zipFileMediaMachine() {
		window.location.href = AppConsts.remoteServiceBaseUrl + "download/zipFileMediaMachine";
	}
	downloadFileInFolder(pathFolder: number, pathFile: string) {
		let pathFolder_modified = encodeURI(pathFolder + "");
		let pathFile_modified = encodeURI(pathFile + "");
		return `${AppConsts.remoteServiceBaseUrl} downloadFileInFolder?pathFolder=${pathFolder_modified}&pathFile=${pathFile_modified}`;
	}
	
	getImageProduct(md5: string) {
		let fi_md5_modified = encodeURI(md5);
		return AppConsts.remoteServiceBaseUrl + "download/imageProduct?path=" + fi_md5_modified;
	}
	getImageFileMedia(md5: string) {
		let fi_md5_modified = encodeURI(md5);
		return AppConsts.remoteServiceBaseUrl + "download/fileMedia?path=" + fi_md5_modified;
	}

	print = (id) => {
		let oldPage = document.body.innerHTML;
		let printableElements = document.getElementById(id).innerHTML;
		document.body.innerHTML = printableElements;
		window.print();
		window.close();
		document.body.innerHTML = oldPage;
	}
	getStartDate = (date:Moment|undefined):Moment => {
		return moment(date).millisecond(0)
	}
	getEndDate = (date:Moment|undefined):Moment => {
		return moment(date).millisecond(997)
	}
	async zipImageProductByNames(imageNames: string[], isCanCel?: boolean) {
		const controller = new AbortController();
		const signal = controller.signal;
		if (!isCanCel) {
			await fetch(`${AppConsts.remoteServiceBaseUrl}download/zipImageProductByNames`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				signal: signal,
				body: JSON.stringify(imageNames),
			})
				.then(response => {
					if (response.ok) {
						return response.blob();
					}
					throw new Error("Failed to download zip file");
				})
				.then(blob => {
					// Create a link to download the file
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = `zipimageproduct_${moment().format("DD/MM/YYYY")}.zip`;
					document.body.appendChild(link);
					link.click();
					link.remove();
				})
				.catch(error => console.error("Error:", error));
		}
		else {
			controller.abort(); /// hủy fetch
		}
	}
	async zipFileMediaMachineByNames(imageNames: string[], isCanCel?: boolean) {
		const controller = new AbortController();
		const signal = controller.signal;
		if (!isCanCel) {
			await fetch(`${AppConsts.remoteServiceBaseUrl}download/zipFileMediaMachineByNames`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				signal: signal,
				body: JSON.stringify(imageNames),
			})
				.then(response => {
					if (response.ok) {
						return response.blob();
					}
					throw new Error("Failed to download zip file");
				})
				.then(blob => {
					// Create a link to download the file
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = `zipFileMediaMachine_${moment().format("DD/MM/YYYY")}.zip`;
					document.body.appendChild(link);
					link.click();
					link.remove();
				})
				.catch(error => console.error("Error:", error));
		}
		else {
			controller.abort(); /// hủy fetch
		}
	}
	async exportExcelAuditLogs(pageSize: number | undefined) {
		var url = pageSize == undefined ? `${AppConsts.remoteServiceBaseUrl}download/ExportToExcel` : `${AppConsts.remoteServiceBaseUrl}download/ExportToExcel?MaxResultCount=${pageSize}`;
		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				if (response.ok) {
					return response.blob();
				}
				throw new Error("Failed to download zip file");
			})
			.then(blob => {
				// Create a link to download the file
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `AuditLogs_${moment().format("YYYYMMddHHmmss")}.xlsx`;
				document.body.appendChild(link);
				link.click();
				link.remove();
			})
			.catch(error => console.error("Error:", error));

	}

	printTag(id: string, headerPrint?: string | undefined) {
		let popupWinindow;
		let innerContents = document.getElementById(id).innerHTML;
		popupWinindow = window.open('', '_blank', 'width=700,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
		popupWinindow.document.open();
		let contentHTML = `<html><head> 
		 <style>
		 .noneBorder table, .noneBorder th, .noneBorder td {border: none !important;}
		 @page {
		 size: auto;
		// contentHTML+="margin-left: 20mm;}" ;
		 @media print {
		 #labelClass {page-break-before:always; }
		 html, body {
		// contentHTML+="margin: 0px; " ;
		// contentHTML+="font-size: 17px; " ;
		// contentHTML+="width: 300mm;" ;
		// contentHTML+="height: 100mm;";
		 }
		 .no-print  { display: none;}
		 table {width: 100%;}
		 table, th, td {border: 0.01em solid black; border-collapse: collapse; text-align: center;}
		 td {padding:0px 7px}
		 }</style></head>
		 <body onload='window.print()'> ${innerContents}</html>`
		popupWinindow.document.write(contentHTML);
		popupWinindow.document.close();

	}

	}

export default AppComponentBase;
