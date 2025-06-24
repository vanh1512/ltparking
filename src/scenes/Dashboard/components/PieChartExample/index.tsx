import { L } from '@src/lib/abpUtility';
import { StatisticBillingOfPaymentDto } from '@src/services/services_autogen';
import React from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

export class Data {
	public name = '';
	public quantity = 0;
	constructor(name: string, quantity: number) {
		this.name = name;
		this.quantity = quantity;
	}
}

export interface IProps {
	totalBillingPayment?: StatisticBillingOfPaymentDto[];
}

class PieChartPaymentType extends React.Component<IProps> {
	state = {
		activeIndex: 0,
	};

	onPieEnter = (_: any, index: number) => {
		this.setState({
			activeIndex: index,
		});
	};

	render() {
		const COLORS = ['#a5dfdf', '#9ad0f5', '#ccb2ff', '#ffcf9f', '#ffb1c1', '#ff708f', '#b3e3e3', '#8bc3ff', '#d1b3ff', '#ff8fa5'];


		const dataWithLabels = this.props.totalBillingPayment?.map((item) => {
			let customLabel = '';
			if (item.name === 'transaction') customLabel = L('ngan_hang');
			else if (item.name === 'rfid') customLabel = 'RFID';
			else if (item.name === 'cash') customLabel = L('tien_mat');
			else if (item.name === 'momo') customLabel = 'Momo';
			else if (item.name === 'vnpay') customLabel = 'VNPAY';

			return {
				...item,
				name: customLabel,
				quantity: item.quantity
			};
		});

		const totalQuantity = dataWithLabels?.reduce((sum, item) => sum + item.quantity, 0) || 0;

		const dataWithPercentages = dataWithLabels?.map((item) => ({
			...item,
			percentage: totalQuantity ? (item.quantity / totalQuantity) * 100 : 0,
		}));

		const renderLabel = (entry: any) => {
			const percentage = entry.percentage;
			return `${percentage.toFixed(2)}%`;
		};

		return (
			<PieChart width={450} height={500}>
				<Pie
					dataKey="quantity"
					data={dataWithPercentages}
					cx="50%"
					cy="50%"
					outerRadius={150}
					fill="#8884d8"
					onMouseEnter={this.onPieEnter}
					label={renderLabel}
				>
					{dataWithPercentages?.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip
					formatter={(value: any, name: string, props: any) => {
						const percentage = props.payload.percentage;
						return [`${value} (${percentage.toFixed(2)}%)`, name];
					}}
				/>
			</PieChart>
		);
	}

}

export default PieChartPaymentType;
