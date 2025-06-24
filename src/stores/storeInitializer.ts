import AccountStore from '@stores/accountStore';
import AuditLogStore from '@stores/auditLogStore';
import AuthenticationStore from '@stores/authenticationStore';
import RoleStore from '@stores/roleStore';
import SessionStore from '@stores/sessionStore';
import TenantStore from '@stores/tenantStore';
import UserStore from '@stores/userStore';
import ApplicationStore from './appicationStore';
import { BillingStore } from './billingStore';
import DashboardStore from './dashboardStore';
import DiscountCodeStore from './discountCode';
import FileStore from './fileStore';
import HookSendAttempt from './hookSendAttempt';
import WebHookSubcription from './hookSubscriptionStore';
import ImportingStore from './importingStore';
import MachineDetailStore from './machineDetailStore';
import MachineStore from './machineStore';
import OrganizationStore from './organizationStore';
import ReportOfMachineStore from './reportOfMachineStore';
import SettingStore from './settingStore';
import StatisticStore from './statisticStore';
import SupplierStore from './supplierStore';
// import PaymentBankStore from '.Bank';
import RFIDStore from './RFIDStore';
import AuthorizationMachineStore from './authorizationMachineStore';
import DailyMonitorStore from './dailyMonitorStore';
import ExportRepositoryStore from './exportRepositoryStore';
import FileMediaStore from './fileMediaStore';
import GroupMachineStore from './groupMachineStore';
import GroupTrashBinStore from './groupTrashBinStore';
import HardwareStore from './hardwareStore';
import HistoryStore from './historyStore';
import ImageProductStore from './imageProductStore';
import ImportRepositoryStore from './importRepositoryStore';
import LayoutStore from './layoutStore';
import LossRepositoryStore from './lossRepositoryStore';
import { MachineSoftStore } from './machineSoft';
import NotificationStore from './notificationStore';
import PaymentBankStore from './paymentBank';
import ProductStore from './productStore';
import ReconcileLogsStore from './reconcileLogs';
import ReconcileStore from './reconcileStore';
import RefundStore from './refundStore';
import RepositoryStore from './repositoryStore';
import RFIDLogs from './rfidLogs';
import TransferRepositoryStore from './transferRepositoryStore';
import TrashBinStore from './trashBinStore';
import WithdrawStore from './withdrawStore';

function initializeStores() {

	return {
		authenticationStore: new AuthenticationStore(),
		roleStore: new RoleStore(),
		tenantStore: new TenantStore(),
		userStore: new UserStore(),
		sessionStore: new SessionStore(),
		organizationStore: new OrganizationStore(),
		accountStore: new AccountStore(),
		auditLogStore: new AuditLogStore(),
		supplierStore: new SupplierStore(),
		webHookSubcriptionStore: new WebHookSubcription(),
		hookSendAttemptStore: new HookSendAttempt(),
		applicationStore: new ApplicationStore(),
		settingStore: new SettingStore(),
		dashboardStore: new DashboardStore(),
		machineStore: new MachineStore(),
		machineDetailStore: new MachineDetailStore(),
		discountCodeStore: new DiscountCodeStore(),
		statisticStore: new StatisticStore(),
		billingStore: new BillingStore(),
		importingStore: new ImportingStore(),
		paymentBank: new PaymentBankStore(),
		rfidLogStore: new RFIDLogs(),
		RFIDStore: new RFIDStore(),
		fileStore: new FileStore(),
		reportOfMachineStore: new ReportOfMachineStore(),
		groupMachineStore: new GroupMachineStore(),
		dailyMonitorStore: new DailyMonitorStore(),
		historyStore: new HistoryStore(),
		withDrawStore: new WithdrawStore(),
		machineSoftStore: new MachineSoftStore(),
		refundStore: new RefundStore(),
		reconcileStore: new ReconcileStore(),
		reconcileLogsStore: new ReconcileLogsStore(),
		imageProductStore: new ImageProductStore(),
		authorizationMachineStore: new AuthorizationMachineStore(),
		importRepositoryStore: new ImportRepositoryStore(),
		productStore: new ProductStore(),
		repositoryStore: new RepositoryStore(),
		transferRepositoryStore: new TransferRepositoryStore(),
		exportRepositoryStore: new ExportRepositoryStore(),
		layoutStore: new LayoutStore(),
		notificationStore: new NotificationStore(),
		trashBinStore: new TrashBinStore(),
		groupTrashBinStore: new GroupTrashBinStore(),
		fileMediaStore: new FileMediaStore(),
		hardWareStore: new HardwareStore(),
		lossRepositoryStore: new LossRepositoryStore(),
	};
}
export const stores = initializeStores();
