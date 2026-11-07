import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { ItemsBalancesReportRequest } from '../../core/interfaces/items-balances-report';
import { ReportShellComponent } from '../report-shared/report-shell.component';
import { StoreScopeFieldComponent } from '../report-shared/store-scope-field.component';

@Component({
  selector: 'app-report-item-balances',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportShellComponent, StoreScopeFieldComponent],
  templateUrl: './report-item-balances.component.html'
})
export class ReportItemBalancesComponent {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  firstItem: string = '';
  endItem: string = '';
  /** a single-store user starts locked on their own store, a multi-store user must pick one */
  storeCode: string | null = this.storeScope.initialCode(false);

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  loading = false;
  private lastReqBody?: ItemsBalancesReportRequest;

  hasFirstItemError(): boolean {
    return !this.firstItem?.trim();
  }

  hasEndItemError(): boolean {
    return !this.endItem?.trim();
  }

  hasStoreCodeError(): boolean {
    return this.storeScope.storeError(this.storeCode, false);
  }

  isFormInvalid(): boolean {
    return this.hasFirstItemError() || this.hasEndItemError() || this.hasStoreCodeError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: ItemsBalancesReportRequest = {
      firstItem: this.firstItem,
      endItem: this.endItem,
      storeCode: this.storeScope.effectiveCode(this.storeCode) ?? '',
      sysInfo: this.storeScope.sysInfo()
    };

    this.lastReqBody = reqBody;
    this.loading = true;

    this.reportService.getItemsBalancesReport(reqBody).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.excelReportFlag = 1;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  downloadExcel(): void {
    if (!this.lastReqBody) {
      return;
    }

    this.reportService.ExcelReport_getItemsBalancesReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ItemsBalancesReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
