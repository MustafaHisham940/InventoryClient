/**
 * Every page (route) a role can be allowed to open.
 *
 * `key` is the route path (or `data.page` when two routes would otherwise share a key ignoring case).
 * The role-permissions screen shows this list grouped by `group`; the page guard looks the key up in the
 * pages the logged-in user's roles allow. A new screen = a new route + one line here.
 */
export interface AppPage {
  key: string;
  label: string;
  group: string;
}

export const PAGES: AppPage[] = [
  // الرئيسية
  { key: 'home', label: 'لوحة التحكم', group: 'الرئيسية' },

  // المنتجات
  { key: 'items', label: 'قائمة المنتجات', group: 'المنتجات' },
  { key: 'itemdetails', label: 'عرض منتج', group: 'المنتجات' },
  { key: 'itemdedite', label: 'تعديل منتج', group: 'المنتجات' },
  { key: 'itemsadd', label: 'إضافة منتج', group: 'المنتجات' },
  { key: 'categories', label: 'الفئات', group: 'المنتجات' },

  // العملاء
  { key: 'customers', label: 'قائمة العملاء', group: 'العملاء' },
  { key: 'addClient', label: 'إضافة عميل', group: 'العملاء' },
  { key: 'editeClient', label: 'تعديل عميل', group: 'العملاء' },
  { key: 'deleteClient', label: 'حذف عميل', group: 'العملاء' },
  { key: 'showClient', label: 'عرض عميل', group: 'العملاء' },

  // المخازن
  { key: 'Stores', label: 'قائمة المخازن', group: 'المخازن' },
  { key: 'AddNewStore', label: 'إضافة مخزن', group: 'المخازن' },
  { key: 'editeStore', label: 'تعديل مخزن', group: 'المخازن' },

  // أرصدة الأصناف
  { key: 'StoreSelection', label: 'اختيار المخزن للأرصدة', group: 'أرصدة الأصناف' },
  { key: 'ItemBalance', label: 'أرصدة الأصناف', group: 'أرصدة الأصناف' },
  { key: 'addITemBalance', label: 'إضافة رصيد', group: 'أرصدة الأصناف' },
  { key: 'editeITemBalance', label: 'تعديل رصيد', group: 'أرصدة الأصناف' },
  { key: 'NewITemBalance', label: 'إدخال رصيد صنف جديد', group: 'أرصدة الأصناف' },

  // الفواتير والحركات
  { key: 'SelectStore', label: 'اختيار المخزن للحركات', group: 'الفواتير والحركات' },
  { key: 'Transactions', label: 'الحركات (فواتير)', group: 'الفواتير والحركات' },
  { key: 'addNewHeader', label: 'إضافة فاتورة', group: 'الفواتير والحركات' },
  { key: 'addNewHeaderSeperate', label: 'إضافة فاتورة (منفصلة)', group: 'الفواتير والحركات' },
  { key: 'addNewDetail', label: 'إضافة تفصيل فاتورة', group: 'الفواتير والحركات' },
  { key: 'itemsStandaloneTable', label: 'جدول الأصناف', group: 'الفواتير والحركات' },
  { key: 'CutomerStandaloneTable', label: 'جدول العملاء', group: 'الفواتير والحركات' },

  // النقدية
  { key: 'ClientPaymentsMain', label: 'مدفوعات العملاء', group: 'النقدية' },
  { key: 'ClientPaymentsAddnew', label: 'إضافة مدفوعات عميل', group: 'النقدية' },
  { key: 'ClientPaymentsEdite', label: 'تعديل مدفوعات عميل', group: 'النقدية' },
  { key: 'ClientCashMain', label: 'تسديدات موردين', group: 'النقدية' },
  { key: 'ClientCashAddnew', label: 'إضافة تسديد مورد', group: 'النقدية' },
  { key: 'ClientCashEdite', label: 'تعديل تسديد مورد', group: 'النقدية' },
  { key: 'personalWithdrwalMain', label: 'المسحوبات الشخصية', group: 'النقدية' },
  { key: 'personalWithdrwalAddnew', label: 'إضافة مسحوب شخصي', group: 'النقدية' },
  { key: 'personalWithdrwalEdite', label: 'تعديل مسحوب شخصي', group: 'النقدية' },
  { key: 'ExpensesMain', label: 'المصروفات', group: 'النقدية' },
  { key: 'ExpensesAddnew', label: 'إضافة مصروف', group: 'النقدية' },
  { key: 'ExpensesEdite', label: 'تعديل مصروف', group: 'النقدية' },

  // التقارير
  { key: 'AllReports', label: 'كل التقارير', group: 'التقارير' },
  { key: 'ItemCardReport', label: '1-بطاقة حركة صنف', group: 'التقارير' },
  { key: '2reportItemList', label: '2-تقرير قائمة الأصناف', group: 'التقارير' },
  { key: '3reportItemBalances', label: '3-تقرير أرصدة الأصناف', group: 'التقارير' },
  { key: '4reportInventoryEvaluation', label: '4-تقرير تقييم المخزون', group: 'التقارير' },
  { key: '5reportInventorySales', label: '5-بيان مبيعات الأصناف', group: 'التقارير' },
  { key: '6reportInventoryPurchases', label: '6-بيان مشتريات الأصناف', group: 'التقارير' },
  { key: '7reportStoreItemsNeed', label: '7-قائمة الاحتياجات من الأصناف', group: 'التقارير' },
  { key: '8reportDetailedItemSales', label: '8-تقرير تفاصيل مبيعات الصنف', group: 'التقارير' },
  { key: '8-2reportDetailedItemPurchases', label: '9-تقرير تفاصيل مشتريات الصنف', group: 'التقارير' },
  { key: '9reportItemsEvaluationInDuration', label: '10-تقرير تقييم الأصناف خلال فترة', group: 'التقارير' },
  { key: 'ClientCheckupReport', label: '10-كشف حساب عميل', group: 'التقارير' },
  { key: '11reportCustomerItemsSales', label: '11-تقرير مبيعات العملاء للأصناف', group: 'التقارير' },
  { key: '12reportCustomersSuppliersList', label: '12-تقرير العملاء والموردين', group: 'التقارير' },
  { key: '13reportClientSalesDetailed', label: '13-تقرير تفاصيل مبيعات العميل', group: 'التقارير' },
  { key: '14reportClientPurchasesDetailed', label: '14-تقرير تفاصيل مشتريات العميل', group: 'التقارير' },
  { key: '15reportDailyBox', label: '15-كشف حساب الصندوق', group: 'التقارير' },
  { key: '16reportExistDailyBox', label: '16-إقفال يومية الصندوق', group: 'التقارير' },

  // ضبط التكلفة
  { key: 'CostControl', label: 'ضبط التكلفة', group: 'ضبط التكلفة' },
  { key: 'CostControlbySearch', label: 'ضبط التكلفة بالبحث', group: 'ضبط التكلفة' },
  { key: 'CostControlAllItems', label: 'ضبط تكلفة كل الأصناف', group: 'ضبط التكلفة' },
  { key: 'CostControlReport', label: 'تقرير ضبط التكلفة', group: 'ضبط التكلفة' },

  // المستخدمون والصلاحيات
  { key: 'UserDetails', label: 'قائمة المستخدمين', group: 'المستخدمون والصلاحيات' },
  { key: 'UserDataRegister', label: 'إضافة مستخدم', group: 'المستخدمون والصلاحيات' },
  { key: 'register', label: 'تسجيل مستخدم', group: 'المستخدمون والصلاحيات' },
  { key: 'UserDataUpdate', label: 'تعديل بيانات مستخدم', group: 'المستخدمون والصلاحيات' },
  { key: 'UserDataShow', label: 'عرض بيانات مستخدم', group: 'المستخدمون والصلاحيات' },
  { key: 'resetPassword', label: 'إعادة تعيين كلمة المرور', group: 'المستخدمون والصلاحيات' },
  { key: 'UserRoles', label: 'أدوار المستخدم', group: 'المستخدمون والصلاحيات' },
  { key: 'RolePermissions', label: 'الأدوار والصلاحيات', group: 'المستخدمون والصلاحيات' },
  { key: 'UserStoreAccess', label: 'مخازن المستخدم', group: 'المستخدمون والصلاحيات' },

  // أخرى
  { key: 'notification', label: 'التنبيهات', group: 'أخرى' },
];

/** the groups in display order */
export const PAGE_GROUPS: string[] = PAGES.map(p => p.group).filter((g, i, all) => all.indexOf(g) === i);
