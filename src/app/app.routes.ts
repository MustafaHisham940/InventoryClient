import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { HomeComponent } from './components/home/home.component';
import { ItemsComponent } from './components/items/items.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TestComponent } from './components/test/test.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { EditeCustomerComponent } from './components/edite-customer/edite-customer.component';
import { DeleteClientComponent } from './components/delete-client/delete-client.component';
import { ShowClientComponent } from './components/show-client/show-client.component';
import { ItemsShowComponent } from './components/items-show/items-show.component';
import { ItemsEditeComponent } from './components/items-edite/items-edite.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { authGuard } from './core/guards/auth.guard';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserRolesComponent } from './components/user-roles/user-roles.component';
import { rolesGuard } from './core/guards/roles.guard';
import { UpdateUserDataComponent } from './components/update-user-data/update-user-data.component';
import { ShowUserDetailsComponent } from './components/show-user-details/show-user-details.component';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { CtgComponent } from './components/ctg/ctg.component';
import { StoresmainComponent } from './components/storesmain/storesmain.component';
import { AddStoreComponent } from './components/add-store/add-store.component';
import { EditeStoreComponent } from './components/edite-store/edite-store.component';
import { ItemBalanceComponent } from './components/item-balance/item-balance.component';
import { AddItemBalComponent } from './components/add-item-bal/add-item-bal.component';
import { EditeItemBalComponent } from './components/edite-item-bal/edite-item-bal.component';
import { NavToItemBalComponent } from './components/nav-to-item-bal/nav-to-item-bal.component';
import { NewItmBalComponent } from './components/new-itm-bal/new-itm-bal.component';
import { SelectStoreComponent } from './components/select-store/select-store.component';
import { TrnsPurchacesComponent } from './components/trns-purchaces/trns-purchaces.component';
import { ItemsTableSeprateComponent } from './components/CustomTables/items-table-seprate/items-table-seprate.component';
import { CustomerTableSeprateComponent } from './components/CustomTables/customer-table-seprate/customer-table-seprate.component';
import { AddNewDetailsComponent } from './components/add-new-details/add-new-details.component';
import { AddNewHeaderComponent } from './components/add-new-header/add-new-header.component';
import { DynamicTransactionsComponent } from './components/dynamic-transactions/dynamic-transactions.component';
import { unsavedChangesGuardGuard } from './core/guards/unsaved-changes-guard.guard';
import { ReportsComponent } from './components/reports/reports.component';
import { CheckupBalComponent } from './components/checkup-bal/checkup-bal.component';
import { ReportItemsCardComponent } from './components/report-items-card/report-items-card.component';
import { AllReportsComponent } from './components/all-reports/all-reports.component';
import { CostControlComponent } from './components/cost-control/cost-control.component';
import { SlidingNotificationComponent } from './components/sliding-notification/sliding-notification.component';
import { AddNewHeaderSepreateComponent } from './components/add-new-header-sepreate/add-new-header-sepreate.component';
import { AdjusCostForAllItemsComponent } from './components/adjus-cost-for-all-items/adjus-cost-for-all-items.component';
import { ModifiyCostbySearchComponent } from './components/modifiy-costby-search/modifiy-costby-search.component';
import { ReportCostControlComponent } from './components/report-cost-control/report-cost-control.component';
import { ReportItemListComponent } from './components/report-item-list/report-item-list.component';
import { ReportItemBalancesComponent } from './components/report-item-balances/report-item-balances.component';
import { ReportInventorySalesComponent } from './components/report-inventory-sales/report-inventory-sales.component';
import { InventoryPurchacesReportComponent } from './components/inventory-purchaces-report/inventory-purchaces-report.component';
import { ReportDetailedItemSalesComponent } from './components/report-detailed-item-sales/report-detailed-item-sales.component';
import { ReportDetailedItemPurchasesComponent } from './components/report-detailed-item-purchases/report-detailed-item-purchases.component';
import { ReportItemsEvaluationInDurationComponent } from './components/report-items-evaluation-in-duration/report-items-evaluation-in-duration.component';
import { ClientSalesDetailedReportComponent } from './components/client-sales-detailed-report/client-sales-detailed-report.component';
import { CustomersSuppliersListReportComponent } from './components/customers-suppliers-list-report/customers-suppliers-list-report.component';
import { ClientPurchasesDetailedReportComponent } from './components/client-purchases-detailed-report/client-purchases-detailed-report.component';
import { ReportDailyBoxComponent } from './components/report-daily-box/report-daily-box.component';
import { ReportExistDailyBoxComponent } from './components/report-exist-daily-box/report-exist-daily-box.component';
import { ReportInventoryEvaluationNewRepComponent } from './components/report-inventory-evaluation-new-rep/report-inventory-evaluation-new-rep.component';
import { ReportStoreItemsNeedComponent } from './components/report-store-items-need/report-store-items-need.component';
import { ReportCustomerItemsSalesComponent } from './components/report-customer-items-sales/report-customer-items-sales.component';
import { ClientPaymentsMainComponent } from './components/client-payments/client-payments-main/client-payments-main.component';
import { ClientPaymentsAddnewComponent } from './components/client-payments/client-payments-addnew/client-payments-addnew.component';
import { ClientPaymentsEditeComponent } from './components/client-payments/client-payments-edite/client-payments-edite.component';
import { ClientCashMainComponent } from './components/client-cash/client-cash-main/client-cash-main.component';
import { ClientCashAddnewComponent } from './components/client-cash/client-cash-addnew/client-cash-addnew.component';
import { ClientCashEditeComponent } from './components/client-cash/client-cash-edite/client-cash-edite.component';
import { PersonalWithdrwalMainComponent } from './components/personal-withdrwal/personal-withdrwal-main/personal-withdrwal-main.component';
import { PersonalWithdrwalAddnewComponent } from './components/personal-withdrwal/personal-withdrwal-addnew/personal-withdrwal-addnew.component';
import { PersonalWithdrwalEditeComponent } from './components/personal-withdrwal/personal-withdrwal-edite/personal-withdrwal-edite.component';
import { ExpensesMainComponent } from './components/expenses/expenses-main/expenses-main.component';
import { ExpensesAddnewComponent } from './components/expenses/expenses-addnew/expenses-addnew.component';
import { ExpensesEditeComponent } from './components/expenses/expenses-edite/expenses-edite.component';


export const routes: Routes = [

   {path:'' ,component:AuthComponent  , 
        children:[
        {path:'' , redirectTo:'login' , pathMatch:'full'},
        {path:'login' , component:LoginComponent},
        {path:'register' , component:RegisterComponent}
        

    ]},
    {path:'' , component:MainComponent, canActivate:[authGuard],
        children:[
            {path:'' , redirectTo:'home' , pathMatch:'full'},
            {path:'home' , component:HomeComponent ,data:{ roles :['الصفحة الرئيسة']} ,canActivate:[rolesGuard]},
            {path:'reporting' , component:ReportsComponent} ,
            {path:'items' , component:ItemsComponent,data:{ roles :['صفحة المنتجات']} ,canActivate:[rolesGuard]},
            {path:'customers' , component:CustomersComponent,data:{ roles :['صفحة العملاء']} ,canActivate:[rolesGuard]},
            {path:'test' , component:ReportsComponent},
            {path:'addClient', component:AddClientComponent,data:{ roles :['صفحة العملاء']} ,canActivate:[rolesGuard]},
            {path:'editeClient', component:EditeCustomerComponent,data:{ roles :['صفحة العملاء']} ,canActivate:[rolesGuard] ,  canDeactivate: [unsavedChangesGuardGuard]},
            {path:'deleteClient', component:DeleteClientComponent,data:{ roles :['صفحة العملاء']} ,canActivate:[rolesGuard]},
            {path:'showClient', component:ShowClientComponent,data:{ roles :['صفحة العملاء']} ,canActivate:[rolesGuard]},
            {path:'items', component:ItemsComponent,data:{ roles :['صفحة المنتجات']} ,canActivate:[rolesGuard]},
            {path:'itemdetails', component:ItemsShowComponent,data:{ roles :['صفحة المنتجات']} ,canActivate:[rolesGuard]},
            {path:'itemdedite', component:ItemsEditeComponent,data:{ roles :['صفحة المنتجات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'itemsadd', component:AddItemComponent,data:{ roles :['صفحة المنتجات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'register' , component:RegisterComponent,data:{ roles :['صفحة المستخدمين']} ,canActivate:[rolesGuard]},
            {path:'UserDetails' , component:UserDetailsComponent,data:{ roles :['صفحة المستخدمين']} ,canActivate:[rolesGuard]},
            {path:'UserRoles' , component:UserRolesComponent,data:{ roles :['صفحة المستخدمين']} ,canActivate:[rolesGuard]},
            {path:'UserDataUpdate' , component:UpdateUserDataComponent,data:{ roles :['صفحة المستخدمين']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'UserDataShow' , component:ShowUserDetailsComponent,data:{ roles :['صفحة المستخدمين']} ,canActivate:[rolesGuard]},
            {path:'UserDataRegister' , component:AddNewUserComponent,data:{ roles :['صفحة المستخدمين']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'resetPassword' , component:ResetPasswordComponent,data:{ roles :['صفحة المستخدمين']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'categories' , component:CtgComponent,data:{ roles :['صفحة الفئات']} ,canActivate:[rolesGuard]},
            {path:'Stores' , component:StoresmainComponent,data:{ roles :['صفحة تعريف المخازن']} ,canActivate:[rolesGuard]},
            {path:'AddNewStore' , component:AddStoreComponent,data:{ roles :['صفحة تعريف المخازن']} ,canActivate:[rolesGuard]},            
            {path:'editeStore' , component:EditeStoreComponent,data:{ roles :['صفحة تعريف المخازن']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'StoreSelection' , component:NavToItemBalComponent,data:{ roles :['ارصدة الاصناف']} ,canActivate:[rolesGuard]},
            {path:'ItemBalance' , component:ItemBalanceComponent,data:{ roles :['ارصدة الاصناف']} ,canActivate:[rolesGuard]},
            {path:'addITemBalance' , component:AddItemBalComponent,data:{ roles :['ارصدة الاصناف']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'editeITemBalance' , component:EditeItemBalComponent,data:{ roles :['ارصدة الاصناف']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'AddITemBalance' , component:NewItmBalComponent,data:{ roles :['ارصدة الاصناف']} ,canActivate:[rolesGuard]},
            {path:'SelectStore' , component:SelectStoreComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'Transactions' , component:DynamicTransactionsComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},            
            {path:'itemsStandaloneTable' , component:ItemsTableSeprateComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},            
            {path:'CutomerStandaloneTable' , component:CustomerTableSeprateComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},            
            {path:'addNewDetail' , component:AddNewDetailsComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},            
            {path:'addNewHeader' , component:AddNewHeaderComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},            
            {path:'addNewHeaderSeperate' , component:AddNewHeaderSepreateComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},            
            {path:'ClientCheckupReport' , component:CheckupBalComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},            
            {path:'ItemCardReport' , component:ReportItemsCardComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},            
            {path:'AllReports' , component:ReportsComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},            
            {path:'CostControl' , component:CostControlComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},            
           
            {path:'2reportItemList' , component:ReportItemListComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'3reportItemBalances' , component:ReportItemBalancesComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'4reportInventoryEvaluation' , component:ReportInventoryEvaluationNewRepComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},

            {path:'5reportInventorySales' , component:ReportInventorySalesComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'6reportInventoryPurchases' , component:InventoryPurchacesReportComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'7reportStoreItemsNeed' , component:ReportStoreItemsNeedComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},

            {path:'8reportDetailedItemSales' , component:ReportDetailedItemSalesComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'8-2reportDetailedItemPurchases' , component:ReportDetailedItemPurchasesComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'9reportItemsEvaluationInDuration' , component:ReportItemsEvaluationInDurationComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
           
           {path:'11reportCustomerItemsSales' , component:ReportCustomerItemsSalesComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
           {path:'12reportCustomersSuppliersList' , component:CustomersSuppliersListReportComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'13reportClientSalesDetailed' , component:ClientSalesDetailedReportComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},            
            {path:'14reportClientPurchasesDetailed' , component:ClientPurchasesDetailedReportComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'15reportDailyBox' , component:ReportDailyBoxComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'16reportExistDailyBox' , component:ReportExistDailyBoxComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
        
            {path:'CostControlbySearch' , component:ModifiyCostbySearchComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},            
            {path:'CostControlAllItems' , component:AdjusCostForAllItemsComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},            
            {path:'CostControlReport' , component:ReportCostControlComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},            
            {path:'notification' , component:SlidingNotificationComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'ClientPaymentsMain' , component:ClientPaymentsMainComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'ClientPaymentsAddnew' , component:ClientPaymentsAddnewComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'ClientPaymentsEdite' , component:ClientPaymentsEditeComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'ClientCashMain' , component:ClientCashMainComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'ClientCashAddnew' , component:ClientCashAddnewComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'ClientCashEdite' , component:ClientCashEditeComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'personalWithdrwalMain' , component:PersonalWithdrwalMainComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'personalWithdrwalAddnew' , component:PersonalWithdrwalAddnewComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'personalWithdrwalEdite' , component:PersonalWithdrwalEditeComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'ExpensesMain' , component:ExpensesMainComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard]},
            {path:'ExpensesAddnew' , component:ExpensesAddnewComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'ExpensesEdite' , component:ExpensesEditeComponent,data:{ roles :['المشتروات']} ,canActivate:[rolesGuard],canDeactivate: [unsavedChangesGuardGuard]},
            
            
        ]
    },
    {path:'**' , component:AuthComponent}




];
