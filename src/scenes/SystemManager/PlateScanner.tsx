import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as signalR from '@microsoft/signalr';
import AppConsts, { formatStringDMYhms } from '../../lib/appconst';
import { Button, Card, Col, message, Modal, Row, Space } from 'antd';
import moment from 'moment';
import { eAllowInOut, eEndShift, eInOutStatus, eShiftStatus } from '@src/lib/enumconst';
import { L } from '@src/lib/abpUtility';
import { stores } from '@src/stores/storeInitializer';
import TableReportTurnoverOfCurrentVehicle from './TableReportTurnoverOfCurrentVehicle';
import { SearchOutlined } from '@ant-design/icons';
import signalRAspNetCoreHelper from '@src/lib/signalRAspNetCoreHelper';
const { confirm } = Modal;

const PlateScanner = () => {

	const webcamRef = useRef<Webcam>(null);
	const [image, setImageSrc] = useState<string | null>(null);
	const [imageFace, setimageFace] = useState<string | null>(null);
	const [plateText, setPlateText] = useState('');
	const [feeText, setFeeText] = useState(0);
	const [inoutStatus, setinoutStatus] = useState(undefined);
	const [Status, setStatus] = useState(false);
	const [TimeIn, setTimeIn] = useState(undefined);
	const [TimeOut, setTimeOut] = useState(undefined);
	const [Note, setNote] = useState('');
	const [isPlateImage, setisPlateImage] = useState(true);
	const [isChangeToTable, setisChangeToTable] = useState(false);
	const [visibleModal, setvisibleModal] = useState(false);
	const [logoutData, setLogoutData] = useState<any>(null);
	const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

	useEffect(() => {
		getAll();
		connectSignalR();
		// const handleBeforeUnload = (event: BeforeUnloadEvent) => {
		// 	sendRequest("Logout", { isEnd: false });
		// 	event.preventDefault();
		// };

		// window.addEventListener("beforeunload", handleBeforeUnload);

		// return () => {
		// 	window.removeEventListener("beforeunload", handleBeforeUnload);
		// };
	}, []);

	const getAll = async () => {
		await stores.fastApiStore.getTurnoverOfCurrentVehicle(undefined, undefined, undefined);

	};
	const connectSignalR = async () => {
		// const connection = new signalR.HubConnectionBuilder()
		// 	.withUrl(AppConsts.remoteServiceBaseUrl + "migvnotify",)
		// 	.build();

		// connection.on("plateNumber", async (data) => {
		// 	data = JSON.parse(data);
		// 	console.log("✅ Received plateNumber:", data, data.Status);
		// 	if (data.InOutStatus == eInOutStatus.WAITSETIMAGEIN.num || data.InOutStatus == eInOutStatus.WAITSETIMAGEOUT.num) {
		// 		setisPlateImage(false);
		// 	}
		// 	if (data.InOutStatus == eInOutStatus.IN.num || data.InOutStatus == eInOutStatus.OUT.num) {
		// 		setImageSrc(null);
		// 		setStatus(false);
		// 	}
		// 	else {
		// 		await setStatus(data.Status);
		// 		if (data.Status) {
		// 			setPlateText(data.PlateNumber);
		// 			setFeeText(data.Fee);
		// 			setinoutStatus(data.InOutStatus);
		// 			setTimeIn(data.TimeIn);
		// 			setTimeOut(data.TimeOut);
		// 		}
		// 		else {
		// 			setNote(data.Note);
		// 		}
		// 	}
		// });
		// connection.on("logout", async (data) => {
		// 	logOut(data);
		// });
		// connection
		// 	.start()
		// 	.then(() => {
		// 		console.log("🔗 SignalR Connected");
		// 		return connection.invoke("Register");
		// 	})
		// 	.then(() => {
		// 		console.log("✅ Registered successfully");
		// 	})
		// 	.catch((err) => {
		// 		console.error("❌ Connection error:", err);
		// 	});
		// return () => {
		// 	connection.stop();
		// };
		signalRAspNetCoreHelper.registerNotificationHandler(['plateNumber'], [processImage]);
		signalRAspNetCoreHelper.registerNotificationHandler(['logOut'], [logOut]);

	};
	const processImage = async (data) => {
		data = JSON.parse(data);
		if (data.InOutStatus == eInOutStatus.WAITSETIMAGEIN.num || data.InOutStatus == eInOutStatus.WAITSETIMAGEOUT.num) {
			setisPlateImage(false);
		}
		if (data.InOutStatus == eInOutStatus.IN.num || data.InOutStatus == eInOutStatus.OUT.num) {
			setImageSrc(null);
			setStatus(false);
		}
		else {
			await setStatus(data.Status);
			if (data.Status) {
				setPlateText(data.PlateNumber);
				setFeeText(data.Fee);
				setinoutStatus(data.InOutStatus);
				setTimeIn(data.TimeIn);
				setTimeOut(data.TimeOut);
			}
			else {
				setNote(data.Note);
			}
		}
	};
	const captureImagePlate = async () => {
		const image = webcamRef.current?.getScreenshot();
		setImageSrc(image!);
		if (image) {
			await sendRequest("PublishMessage", { image, allowInOut: eAllowInOut.NO.num });
		}
		else {
			setPlateText("No image detected!!!");
		}
	};
	const captureImageFace = async () => {
		const imageFace = webcamRef.current?.getScreenshot();
		setimageFace(imageFace!);
		if (imageFace) {
			await sendRequest("PublishMessage", { imageFace, inoutStatus: inoutStatus });
			setisPlateImage(true);
			await message.success(`Chụp ảnh toàn cảnh thành công`, 2)
			setimageFace('');

		}
		else {
			setPlateText("No image detected!!!");
		}
	};
	const toggleCamera = () => {
		setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
	};
	const AllowInOut = async () => {
		await sendRequest("PublishMessage", { image, allowInOut: eAllowInOut.YES.num });
		message.success(`Cho xe ${inoutStatus == 0 ? "vào" : "ra"} thành công`, 2)
		setisPlateImage(false);
		setImageSrc('');
	};
	const retakeImage = () => {
		setImageSrc('');
		setimageFace('');
		setPlateText('');
		setNote('');
		setStatus(false);
	};
	const videoConstraints = {
		facingMode: { exact: facingMode }
	};
	const sendRequest = async (serviceName: string, values: any) => {

		await fetch(AppConsts.remoteServiceBaseUrl + "api/services/app/FastAPI/" + serviceName, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ result: JSON.stringify(values) })
		});

	};
	const logOut = async (data) => {
		data = JSON.parse(data);
		setLogoutData(data);
		setvisibleModal(true);
		// confirm({
		// 	title: (
		// 		<>
		// 			Bạn có muốn kết thúc ca (bắt đầu từ: <strong>{moment(data.TimeIn).format(formatStringDMYhms)}</strong>)? Tổng tiền là: <strong>{AppConsts.formatNumber(data.Fee)} VNĐ</strong>
		// 		</>
		// 	),
		// 	okText: L('Xác nhận'),
		// 	cancelText: L('Hủy'),
		// 	async onOk() {
		// 		window.location.reload();
		// 		message.success(L("Đăng xuất!!!"))
		// 		localStorage.removeItem("shiftID");
		// 	},
		// 	async onCancel() {
		// 		message.success(L("Tiếp tục"))
		// 	},
		// });

	}
	const onChangetoTable = () => {
		setisChangeToTable(!isChangeToTable);
	}
	const resetWhenLogout = () => {
		message.success(L("Đăng xuất!!!"));
		localStorage.removeItem("shiftID");
		localStorage.removeItem("gateID");
		signalRAspNetCoreHelper.stopConnection();
		window.location.reload();

	}
	return (
		(
			isChangeToTable ?
				<Card>
					<TableReportTurnoverOfCurrentVehicle onBack={() => setisChangeToTable(false)} />
				</Card>
				:
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: '16px',
						maxWidth: '480px',
						margin: '0 auto',
						width: '100%',
						textAlign: 'center',
					}}
				>
					<Row style={{ width: '100%' }} justify='space-between'>
						<Col offset={6}>
							<h2>{isPlateImage ? "CHỤP BIỂN SỐ" : "CHỤP TOÀN CẢNH"}</h2>
						</Col>
						<Col>
							<Button icon={<SearchOutlined />} type='primary' onClick={onChangetoTable}></Button>
						</Col>
					</Row>
					{(!image && !imageFace) ? (
						<>
							<div style={{ width: '100%', height: '40vh', overflow: 'hidden', borderRadius: '8px' }}>
								<Webcam
									audio={false}
									ref={webcamRef}
									screenshotFormat="image/png"
									style={{ width: '100%', height: 'auto' }}
									videoConstraints={videoConstraints}
								/>
							</div>

							<button
								onClick={toggleCamera}
								style={{ width: '100%', maxWidth: '300px', marginTop: '8px' }}
							>
								🔄 Đổi camera {facingMode === "user" ? "sau" : "trước"}
							</button>
						</>
					) : (
						<img
							src={image ? image : (imageFace ? imageFace : "")}
							alt="Captured"
							style={{ width: '100%', height: '40vh', borderRadius: '8px' }}
						/>
					)}

					<Row style={{
						marginTop: 10, width: '100%', maxWidth: '300px',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
						<Space size={20}>
							<button onClick={retakeImage}
								style={{
									width: '70px',
									height: '70px',
									borderRadius: '50%',
									fontSize: '15px',
									cursor: 'pointer'
								}}>
								🔁 Chụp lại
							</button>
							{isPlateImage ? (
								<button onClick={captureImagePlate}
									style={{
										width: '70px',
										height: '70px',
										borderRadius: '50%',
										fontSize: '15px',
										cursor: 'pointer'
									}}
								>
									📸 Chụp BS
								</button>
							) : (
								<button onClick={captureImageFace}
									style={{
										width: '70px',
										height: '70px',
										borderRadius: '50%',
										fontSize: '15px',
										cursor: 'pointer'
									}}>
									🔁 Chụp TC
								</button>
							)}


						</Space>

					</Row>

					{Status ? (
						<>
							{(inoutStatus == eInOutStatus.WAITIN.num || inoutStatus == eInOutStatus.WAITOUT.num) && (
								<Button
									style={{ marginTop: "15px", width: '100%', maxWidth: '300px' }}
									onClick={AllowInOut}
									type="primary"
								>
									Cho xe {inoutStatus == eInOutStatus.WAITIN.num ? "vào" : "ra"}
								</Button>
							)}
							{plateText && <p><h2>Biển KS: {plateText}</h2></p>}
							{TimeIn && <p><h2>Giờ vào: {moment(TimeIn).format(formatStringDMYhms)}</h2></p>}
							{((inoutStatus == eInOutStatus.WAITOUT.num || inoutStatus == eInOutStatus.WAITSETIMAGEOUT.num) && TimeOut) && <p><h2>Giờ ra: {moment(TimeOut).format(formatStringDMYhms)}</h2></p>}
							{(inoutStatus == eInOutStatus.WAITOUT.num || inoutStatus == eInOutStatus.WAITSETIMAGEOUT.num) && <p><h2>Tiền phí: {AppConsts.formatNumber(feeText)} VNĐ</h2></p>}
						</>
					) : (
						<strong>{Note}</strong>
					)}
					{!Status &&
						<Button
							onClick={() => sendRequest("Logout", { isEnd: eEndShift.NONE.num })}
							type='primary'
							style={{
								position: 'fixed',
								bottom: '16px',
								left: '50%',
								transform: 'translateX(-50%)',
								width: '90%',
								maxWidth: '300px',
								color: 'white',
								border: 'none',
								borderRadius: '8px',
								fontSize: '16px',
								cursor: 'pointer',
							}}
						>
							🚪 Bàn giao ca
						</Button>
					}

					<Modal
						visible={visibleModal}
						onCancel={() => {
							setvisibleModal(false);
							message.success(L("Tiếp tục"));
						}}
						closable={true}
						maskClosable
						title={null}
						footer={[

							<Button key="cancel" onClick={async () => {
								sendRequest("Logout", { isEnd: eEndShift.NO.num });
								resetWhenLogout();
							}}>
								Thoát, ko đóng ca
							</Button>,
							<Button key="confirm" type="primary" onClick={async () => {
								sendRequest("Logout", { isEnd: eEndShift.YES.num });
								resetWhenLogout();
							}}>
								{L('Đóng ca')}
							</Button>
						]}
					>
						{

							<div style={{ fontSize: 'large' }}>
								Bạn có muốn kết thúc ca (bắt đầu từ:{" "}
								<strong>{moment(logoutData ? logoutData.TimeIn : undefined).format(formatStringDMYhms)}</strong>
								)? Tổng tiền là:{" "}
								<strong>{AppConsts.formatNumber(logoutData ? logoutData.Fee : 0)} VNĐ</strong>
							</div>
						}
					</Modal>

				</div>

		)

	);


};

export default PlateScanner;
