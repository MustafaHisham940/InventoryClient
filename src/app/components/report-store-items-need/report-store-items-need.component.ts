import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { StoreItemsNeedReportRequest } from '../../core/interfaces/store-items-need-report';
import { ReportShellComponent } from '../report-shared/report-shell.component';
import { StoreScopeFieldComponent } from '../report-shared/store-scope-field.component';

@Component({
  selector: 'app-report-store-items-need',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportShellComponent, StoreScopeFieldComponent],
  templateUrl: './report-store-items-need.component.html'
})
export class ReportStoreItemsNeedComponent {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  /** a single-store user starts locked on their own store, a multi-store user must pick one */
  storeCode: string | null = this.storeScope.initialCode(false);
  startItem: string = '';
  endtItem: string = '';

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  loading = false;
  private lastReqBody?: StoreItemsNeedReportRequest;

  hasStoreCodeError(): boolean {
    return this.storeScope.storeError(this.storeCode, false);
  }

  hasStartItemError(): boolean {
    return !this.startItem?.trim();
  }

  hasEndtItemError(): boolean {
    return !this.endtItem?.trim();
  }

  isFormInvalid(): boolean {
    return this.hasStoreCodeError()
      || this.hasStartItemError()
      || this.hasEndtItemError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: StoreItemsNeedReportRequest = {
      storeCode: this.storeScope.effectiveCode(this.storeCode) ?? '',
      startItem: this.startItem,
      endtItem: this.endtItem,
      sysInfo: this.storeScope.sysInfo()
    };

    this.lastReqBody = reqBody;
    this.loading = true;

    this.reportService.getStoreItemsNeedReport(reqBody).subscribe({
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

    this.reportService.ExcelReport_getStoreItemsNeedReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'StoreItemsNeedReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
