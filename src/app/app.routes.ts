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
import { pageGuard } from './core/guards/page.guard';
import { RolePermissionsComponent } from './components/role-permissions/role-permissions.component';
import { UserStoreAccessComponent } from './components/user-store-access/user-store-access.component';
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
            {path:'home' , component:HomeComponent ,canActivate:[pageGuard]},
            {path:'reporting' , component:ReportsComponent} ,
            {path:'items' , component:ItemsComponent,canActivate:[pageGuard]},
            {path:'customers' , component:CustomersComponent,canActivate:[pageGuard]},
            {path:'test' , component:ReportsComponent},
            {path:'addClient', component:AddClientComponent,canActivate:[pageGuard]},
            {path:'editeClient', component:EditeCustomerComponent,canActivate:[pageGuard] ,  canDeactivate: [unsavedChangesGuardGuard]},
            {path:'deleteClient', component:DeleteClientComponent,canActivate:[pageGuard]},
            {path:'showClient', component:ShowClientComponent,canActivate:[pageGuard]},
            {path:'items', component:ItemsComponent,canActivate:[pageGuard]},
            {path:'itemdetails', component:ItemsShowComponent,canActivate:[pageGuard]},
            {path:'itemdedite', component:ItemsEditeComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'itemsadd', component:AddItemComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'register' , component:RegisterComponent,canActivate:[pageGuard]},
            {path:'UserDetails' , component:UserDetailsComponent,canActivate:[pageGuard]},
            {path:'UserRoles' , component:UserRolesComponent,canActivate:[pageGuard]},
            {path:'RolePermissions' , component:RolePermissionsComponent ,canActivate:[pageGuard]},
            {path:'UserStoreAccess' , component:UserStoreAccessComponent ,canActivate:[pageGuard]},
            {path:'UserDataUpdate' , component:UpdateUserDataComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'UserDataShow' , component:ShowUserDetailsComponent,canActivate:[pageGuard]},
            {path:'UserDataRegister' , component:AddNewUserComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'resetPassword' , component:ResetPasswordComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'categories' , component:CtgComponent,canActivate:[pageGuard]},
            {path:'Stores' , component:StoresmainComponent,canActivate:[pageGuard]},
            {path:'AddNewStore' , component:AddStoreComponent,canActivate:[pageGuard]},            
            {path:'editeStore' , component:EditeStoreComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'StoreSelection' , component:NavToItemBalComponent,canActivate:[pageGuard]},
            {path:'ItemBalance' , component:ItemBalanceComponent,canActivate:[pageGuard]},
            {path:'addITemBalance' , component:AddItemBalComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'editeITemBalance' , component:EditeItemBalComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'AddITemBalance' , component:NewItmBalComponent,data:{ page :'NewITemBalance'} ,canActivate:[pageGuard]},
            {path:'SelectStore' , component:SelectStoreComponent,canActivate:[pageGuard]},
            {path:'Transactions' , component:DynamicTransactionsComponent,canActivate:[pageGuard]},            
            {path:'itemsStandaloneTable' , component:ItemsTableSeprateComponent,canActivate:[pageGuard]},            
            {path:'CutomerStandaloneTable' , component:CustomerTableSeprateComponent,canActivate:[pageGuard]},            
            {path:'addNewDetail' , component:AddNewDetailsComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},            
            {path:'addNewHeader' , component:AddNewHeaderComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},            
            {path:'addNewHeaderSeperate' , component:AddNewHeaderSepreateComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},            
            {path:'ClientCheckupReport' , component:CheckupBalComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},            
            {path:'ItemCardReport' , component:ReportItemsCardComponent,canActivate:[pageGuard]},            
            {path:'AllReports' , component:ReportsComponent,canActivate:[pageGuard]},            
            {path:'CostControl' , component:CostControlComponent,canActivate:[pageGuard]},            
           
            {path:'2reportItemList' , component:ReportItemListComponent,canActivate:[pageGuard]},
            {path:'3reportItemBalances' , component:ReportItemBalancesComponent,canActivate:[pageGuard]},
            {path:'4reportInventoryEvaluation' , component:ReportInventoryEvaluationNewRepComponent,canActivate:[pageGuard]},

            {path:'5reportInventorySales' , component:ReportInventorySalesComponent,canActivate:[pageGuard]},
            {path:'6reportInventoryPurchases' , component:InventoryPurchacesReportComponent,canActivate:[pageGuard]},
            {path:'7reportStoreItemsNeed' , component:ReportStoreItemsNeedComponent,canActivate:[pageGuard]},

            {path:'8reportDetailedItemSales' , component:ReportDetailedItemSalesComponent,canActivate:[pageGuard]},
            {path:'8-2reportDetailedItemPurchases' , component:ReportDetailedItemPurchasesComponent,canActivate:[pageGuard]},
            {path:'9reportItemsEvaluationInDuration' , component:ReportItemsEvaluationInDurationComponent,canActivate:[pageGuard]},
           
           {path:'11reportCustomerItemsSales' , component:ReportCustomerItemsSalesComponent,canActivate:[pageGuard]},
           {path:'12reportCustomersSuppliersList' , component:CustomersSuppliersListReportComponent,canActivate:[pageGuard]},
            {path:'13reportClientSalesDetailed' , component:ClientSalesDetailedReportComponent,canActivate:[pageGuard]},            
            {path:'14reportClientPurchasesDetailed' , component:ClientPurchasesDetailedReportComponent,canActivate:[pageGuard]},
            {path:'15reportDailyBox' , component:ReportDailyBoxComponent,canActivate:[pageGuard]},
            {path:'16reportExistDailyBox' , component:ReportExistDailyBoxComponent,canActivate:[pageGuard]},
        
            {path:'CostControlbySearch' , component:ModifiyCostbySearchComponent,canActivate:[pageGuard]},            
            {path:'CostControlAllItems' , component:AdjusCostForAllItemsComponent,canActivate:[pageGuard]},            
            {path:'CostControlReport' , component:ReportCostControlComponent,canActivate:[pageGuard]},            
            {path:'notification' , component:SlidingNotificationComponent,canActivate:[pageGuard]},
            {path:'ClientPaymentsMain' , component:ClientPaymentsMainComponent,canActivate:[pageGuard]},
            {path:'ClientPaymentsAddnew' , component:ClientPaymentsAddnewComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'ClientPaymentsEdite' , component:ClientPaymentsEditeComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'ClientCashMain' , component:ClientCashMainComponent,canActivate:[pageGuard]},
            {path:'ClientCashAddnew' , component:ClientCashAddnewComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'ClientCashEdite' , component:ClientCashEditeComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'personalWithdrwalMain' , component:PersonalWithdrwalMainComponent,canActivate:[pageGuard]},
            {path:'personalWithdrwalAddnew' , component:PersonalWithdrwalAddnewComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'personalWithdrwalEdite' , component:PersonalWithdrwalEditeComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'ExpensesMain' , component:ExpensesMainComponent,canActivate:[pageGuard]},
            {path:'ExpensesAddnew' , component:ExpensesAddnewComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            {path:'ExpensesEdite' , component:ExpensesEditeComponent,canActivate:[pageGuard],canDeactivate: [unsavedChangesGuardGuard]},
            
            
        ]
    },
    {path:'**' , component:AuthComponent}




];
