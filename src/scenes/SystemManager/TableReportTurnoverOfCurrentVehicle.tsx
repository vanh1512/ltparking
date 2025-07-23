import React, { useState } from 'react';
import AppConsts, { formatStringDMYhms } from '../../lib/appconst';
import { Button, Card, Divider, Image, Input, Modal, Row, Space, Table } from 'antd';
import moment from 'moment';
import { stores } from '@src/stores/storeInitializer';
import { ColumnsType } from 'antd/lib/table';
import { ReportTurnoverOfCurrentVehicleDto } from '@src/services/services_autogen';
import TurnoverSearchBar from './TurnoverSearchBar';
import { SearchOutlined } from '@ant-design/icons';
import Login from '../Login';

interface SearchProps {
	onBack: () => void;
}
const TableReportTurnoverOfCurrentVehicle: React.FC<SearchProps> = ({ onBack }) => {
	const [isLoadDone, setisLoadDone] = useState(false);
	const [visibleModal, setvisibleModal] = useState(false);
	const [resultSelected, setresultSelected] = useState<ReportTurnoverOfCurrentVehicleDto | undefined>(undefined);

	const getAll = async (fromDate, toDate) => {
		setisLoadDone(false);
		await stores.fastApiStore.getTurnoverOfCurrentVehicle(fromDate, toDate, [Login.gateID]);
		setisLoadDone(true);
	};
	const columns: ColumnsType<ReportTurnoverOfCurrentVehicleDto> = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			width: '10%',
			sorter: (a, b) => a.id - b.id,
			render: (_: any, item: ReportTurnoverOfCurrentVehicleDto) => <div>{item.id}</div>,
		},
		{
			title: "Ca làm việc",
			dataIndex: "outShiftID",
			key: "outShiftID",
			width: '12%',
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }}>
					<Input
						placeholder="Biển KS"
						value={selectedKeys[0]}
						onChange={e => { setSelectedKeys(e.target.value ? [e.target.value] : []); }}
						style={{ marginBottom: 8, display: "block" }}
					/>
					<Space size={20}>
						<Button icon={<SearchOutlined />} size='middle' type="primary" onClick={() => confirm()}></Button>
						<a onClick={() => { clearFilters?.(); confirm(); }} style={{ color: "#ff4d4f" }}>Reset</a>
					</Space>
				</div>
			),
			filterIcon: (filtered) => (
				<SearchOutlined color={filtered ? 'red' : 'red'} />
			),
			onFilter: (value, record) => {
				return (record.outShiftID ?? "")
					.toString()
					.toLowerCase()
					.includes((value as string).toLowerCase());
			},
			sorter: (a, b) => (a.outShiftID ?? 0) - (b.outShiftID ?? 0),
			render: (_: any, item: ReportTurnoverOfCurrentVehicleDto) => <div>{item.outShiftID}</div>,
		},
		{
			title: "Biển KS",
			dataIndex: "vehicleLPN",
			key: "vehicleLPN",

			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }}>
					<Input
						placeholder="Biển KS"
						value={selectedKeys[0]}
						onChange={e => { setSelectedKeys(e.target.value ? [e.target.value] : []); }}
						style={{ marginBottom: 8, display: "block" }}
					/>
					<Space size={20}>
						<Button icon={<SearchOutlined />} size='middle' type="primary" onClick={() => confirm()}></Button>
						<a onClick={() => { clearFilters?.(); confirm(); }} style={{ color: "#ff4d4f" }}>Reset</a>
					</Space>
				</div>
			),
			filterIcon: (filtered) => (
				<SearchOutlined color={filtered ? 'red' : 'red'} />
			),
			onFilter: (value, record) => {
				return (record.vehicleLPN ?? "")
					.toString()
					.toLowerCase()
					.includes((value as string).toLowerCase());
			},
			width: '12%',

			sorter: (a, b) => (a.vehicleLPN ?? "").localeCompare(b.vehicleLPN ?? ""),
			render: (_: any, item: ReportTurnoverOfCurrentVehicleDto) => <div>{item.vehicleLPN ?? "-"}</div>,
		},
		{
			title: "Giờ vào",
			dataIndex: "inTime",
			width: '12%',
			key: "inTime",
			sorter: (a, b) => {
				const aTime = a.inTime ? new Date(a.inTime).getTime() : 0;
				const bTime = b.inTime ? new Date(b.inTime).getTime() : 0;
				return aTime - bTime;
			},
			render: (_: any, item: ReportTurnoverOfCurrentVehicleDto) => (
				<div>{item.inTime ? moment(item.inTime).format(formatStringDMYhms) : "-"}</div>
			),
		},
		{
			title: "Giờ ra",
			dataIndex: "outTime",
			width: '12%',
			key: "outTime",
			sorter: (a, b) => {
				const aTime = a.outTime ? new Date(a.outTime).getTime() : 0;
				const bTime = b.outTime ? new Date(b.outTime).getTime() : 0;
				return aTime - bTime;
			},
			render: (_: any, item: ReportTurnoverOfCurrentVehicleDto) => (
				<div>{item.outTime ? moment(item.outTime).format(formatStringDMYhms) : "-"}</div>
			),
		},
		{
			title: "Cổng vào",
			dataIndex: "inGate",
			width: '14%',
			key: "inGate",
			sorter: (a, b) => (a.inGate ?? "").localeCompare(b.inGate ?? ""),
			render: (_: any, item: ReportTurnoverOfCurrentVehicleDto) => <div>{item.inGate ?? "-"}</div>,
		},
		{
			title: "Cổng ra",
			dataIndex: "outGate",
			width: '14%',
			key: "outGate",
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }}>
					<Input
						placeholder="Cổng ra"
						value={selectedKeys[0]}
						onChange={e => { setSelectedKeys(e.target.value ? [e.target.value] : []); }}
						style={{ marginBottom: 8, display: "block" }}
					/>
					<Space size={20}>
						<Button icon={<SearchOutlined />} size='middle' type="primary" onClick={() => confirm()}>Tìm</Button>
						<a onClick={() => { clearFilters?.(); confirm(); }} style={{ color: "#ff4d4f" }}>Reset</a>
					</Space>
				</div>
			),
			filterIcon: (filtered) => (
				<SearchOutlined />
			),
			onFilter: (value, record) => {
				return (record.outGate ?? "")
					.toString()
					.toLowerCase()
					.includes((value as string).toLowerCase());
			},
			sorter: (a, b) => (a.outGate ?? "").localeCompare(b.outGate ?? ""),
			render: (_: any, item: ReportTurnoverOfCurrentVehicleDto) => <div>{item.outGate ?? "-"}</div>,
		},
		{
			title: "Tiền",
			dataIndex: "feeAfterDecrease",
			key: "feeAfterDecrease",
			width: '14%',

			sorter: (a, b) => (a.feeAfterDecrease ?? 0) - (b.feeAfterDecrease ?? 0),
			render: (_: any, item: ReportTurnoverOfCurrentVehicleDto) => (
				<div>{item.feeAfterDecrease ? AppConsts.formatNumber(item.feeAfterDecrease) : "-"}</div>
			),
		},

	];
	const { totalCount, reportTurnoverOfCurrentVehicleDto } = stores.fastApiStore;
	return (
		<Space direction='vertical' size={20} style={{ width: '100%' }}>
			<TurnoverSearchBar onSearch={getAll} onBack={onBack} />
			<Row justify='center'>
				<h2><strong>Mã ca làm việc: {Login.shiftID}</strong></h2>
			</Row>
			<Table
				loading={!isLoadDone}
				columns={columns}
				onRow={(record) => {
					return {
						onClick: () => {
							setresultSelected(record); setvisibleModal(true)
						}
					};
				}}
				dataSource={reportTurnoverOfCurrentVehicleDto}
				rowKey={record => "tenant_table_" + JSON.stringify(record)}
				scroll={{ y: window.innerHeight < window.innerWidth ? 50 : 500, x: 'max-content' }} // enable horizontal scroll on phone
				sticky
				bordered={true}
				tableLayout="fixed"
				size="middle"
				className='centerTable'
				pagination={{
					position: ['bottomRight'],
					pageSize: totalCount,
					total: totalCount,
					showTotal: (tot) => "Tổng: " + tot + "",
				}}
				summary={pageData => {
					let totalFee = 0;
					pageData.forEach(({ feeAfterDecrease }) => {
						totalFee += feeAfterDecrease ?? 0;
					});

					return (
						<>
							<Table.Summary.Row>
								<Table.Summary.Cell index={0} colSpan={7} >

								</Table.Summary.Cell>

								<Table.Summary.Cell index={2} >
									Tổng: <strong>{AppConsts.formatNumber(totalFee)}</strong>
								</Table.Summary.Cell>
							</Table.Summary.Row>
						</>
					);
				}}
			/>
			<Modal
				visible={visibleModal}
				onCancel={() => setvisibleModal(false)}
				cancelText="Thoát"
				okButtonProps={{ style: { display: 'none' } }}
			>
				<Space size={20}>

					<Space direction='vertical' size={20}>
						<h2>Hình ảnh vào</h2>
						<Image preview width={'100%'} src={`data:image/png;base64,${resultSelected?.inPlateImageBase64}`} />
						<Image preview width={'100%'} src={!!resultSelected?.inFaceImageBase64 ? `data:image/png;base64,${resultSelected?.inFaceImageBase64}` : process.env.PUBLIC_URL + "/image/no_image.png"} />
					</Space>
					<Space direction='vertical' size={20}>
						<h2>Hình ảnh ra</h2>
						<Image preview width={'100%'} src={`data:image/png;base64,${resultSelected?.outPlateImageBase64}`} />
						<Image preview width={'100%'} src={!!resultSelected?.outFaceImageBase64 ? `data:image/png;base64,${resultSelected?.outFaceImageBase64}` : process.env.PUBLIC_URL + "/image/no_image.png"} />
					</Space>
				</Space>
			</Modal>
		</Space>
	);
};

export default TableReportTurnoverOfCurrentVehicle;
