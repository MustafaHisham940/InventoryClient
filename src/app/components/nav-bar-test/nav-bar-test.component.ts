import { Component, HostListener } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NavbarHoverDirective } from '../../core/directives/navbar-hover.directive';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CollapseDirective } from '../../core/directives/collapse.directive';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface ReportSideMenuItem {
  label: string;
  route?: string;
}

export interface ReportSideMenuGroup {
  key: string;
  title: string;
  items: ReportSideMenuItem[];
}

@Component({
  selector: 'app-nav-bar-test',
  standalone: true,
  imports: [CommonModule , RouterLinkActive , RouterLink,
    RouterModule ,NavbarHoverDirective
    ,MatButtonModule, MatMenuModule, MatIconModule,
     CollapseDirective
   ],
  templateUrl: './nav-bar-test.component.html',
  styleUrl: './nav-bar-test.component.css',
  animations: [
    trigger('slideInOut', [
      state('expanded', style({ width: '300px' })),//300px
      state('collapsed', style({ width: '80px' })),
      
      transition('collapsed <=> expanded', [
        animate('200ms cubic-bezier(.4,0,.2,1)')
      ]),
    ])
  ],
})
export class NavBarTestComponent {
  isCollapsed = false; 
//normaly collapsed
 // navState: 'collapsed' | 'expanded' = 'collapsed';
  //normally expanded
  navState: 'collapsed' | 'expanded' = 'expanded';

  activeReportMenu: string | null = null;
  reportMenuPosition = { top: 0, left: 0 };

  get activeReportGroup(): ReportSideMenuGroup | undefined {
    return this.reportMenuGroups.find((group) => group.key === this.activeReportMenu);
  }

  readonly reportMenuGroups: ReportSideMenuGroup[] = [
    {
      key: 'inventory',
      title: 'تقارير مخزنية',
      items: [
        { label: 'تقرير الأصناف', route: '/AllReports' },
        { label: '1-بطاقة حركة صنف', route: '/ItemCardReport' },
        { label: '2-تقرير قائمة الأصناف', route: '/2reportItemList' },
        { label: '3-تقرير أرصدة الأصناف', route: '/3reportItemBalances' },
        { label: '4-تقرير تقييم المخزون', route: '/4reportInventoryEvaluation' },
        { label: '5-تقرير مبيعات المخزون', route: '/5reportInventorySales' },
        { label: '6-تقرير مشتريات المخزون', route: '/6reportInventoryPurchases' },
        { label: '7-تقرير احتياج الأصناف للمخزن', route: '/7reportStoreItemsNeed' },
        { label: '8-تقرير تفاصيل مبيعات الصنف', route: '/8reportDetailedItemSales' },
        { label: '9-تقرير تقييم الأصناف خلال فترة', route: '/9reportItemsEvaluationInDuration' },    
        //{ label: 'تقرير الحركة المخزنية' },               
       // { label: 'تقرير مرتجعات البيع' },
       // { label: 'تقرير الوارد من التصنيع' },
        //{ label: 'تقرير المنصرف للتصنيع' },
       
       
       
      ],
    },
    {
      key: 'customers',
      title: 'تقارير عملاء',
      items: [
        { label: '10-كشف حساب عميل', route: '/ClientCheckupReport' },
       // { label: 'تقرير أرصدة العملاء' },
       // { label: 'تقرير مدفوعات العملاء' },
       // { label: 'تقرير المدينين' },
       // { label: 'كشف حساب مورد' },
       // { label: 'تقرير أرصدة الموردين' },
        //{ label: 'تقرير المدفوعات للموردين' },
        //{ label: 'تقرير الدائنين' },
      //  { label: 'تقرير أعمار الديون' },
        { label: '11-تقرير مبيعات العملاء للأصناف', route: '/11reportCustomerItemsSales' },
        { label: '12-تقرير العملاء والموردين', route: '/12reportCustomersSuppliersList' },
        { label: '13-تقرير تفاصيل مبيعات العميل', route: '/13reportClientSalesDetailed' },
        { label: '14-تقرير تفاصيل مشتريات العميل', route: '/14reportClientPurchasesDetailed' },
      ],
    },
    {
      key: 'general',
      title: 'عامة تقارير',
      items: [
        { label: 'تقرير ضبط التكلفة', route: '/CostControlReport' },
        /*{ label: 'التقرير العام للمبيعات' },
        { label: 'التقرير العام للمشتروات' },
        { label: 'تقرير الأرباح' },
        { label: 'تقرير المصروفات' },
        { label: 'تقرير التدفقات النقدية' },
        { label: 'تقرير ملخص الحركة' },*/
        { label: 'تقرير المستخدمين', route: '/UserDetails' },
       /* { label: 'تقرير سجل العمليات' },
        { label: 'تقرير إحصائي عام' },*/
      ],
    },
  ];

  toggleNav() {
    this.navState = this.navState === 'collapsed' ? 'expanded' : 'collapsed';
  }
  onNavItemClick(event: Event) {
    this.toggleNav();
    // Optionally, if you want to prevent navigation for demonstration:
     event.preventDefault();
  }

  toggleReportSideMenu(menuKey: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.activeReportMenu === menuKey) {
      this.activeReportMenu = null;
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.reportMenuPosition = {
      top: rect.top,
      left: rect.left,
    };
    this.activeReportMenu = menuKey;
  }

  @HostListener('document:click', ['$event'])
  closeReportSideMenu(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.report-menu-item') || target.closest('.report-side-menu-floating')) {
      return;
    }
    this.activeReportMenu = null;
  }

  collapseState = {
    first: true,
    second: true,  // Starts expanded
    third: true,
    fourth:true,
    fifth:true,
    sixth:true
  };

}
