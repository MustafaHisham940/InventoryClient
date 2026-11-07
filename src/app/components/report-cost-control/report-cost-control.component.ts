import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { ReportShellComponent } from '../report-shared/report-shell.component';
import { StoreScopeFieldComponent } from '../report-shared/store-scope-field.component';

@Component({
  selector: 'app-report-cost-control',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportShellComponent, StoreScopeFieldComponent],
  templateUrl: './report-cost-control.component.html'
})
export class ReportCostControlComponent implements OnDestroy {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  itemCode: string = '';
  /** a single-store user starts locked on their own store, a multi-store user must pick one */
  storeCode: string | null = this.storeScope.initialCode(false);

  pdfUrl?: SafeResourceUrl;
  private currentPdfObjectUrl?: string;
  ExcelReportFlag: number = -1;
  loading = false;

  hasItemCodeError(): boolean {
    return !this.itemCode?.trim();
  }

  hasStoreCodeError(): boolean {
    return this.storeScope.storeError(this.storeCode, false);
  }

  isFormInvalid(): boolean {
    return this.hasItemCodeError() || this.hasStoreCodeError();
  }

  private buildRequest(): any {
    return {
      itemCd: this.itemCode,
      strCd: this.storeScope.effectiveCode(this.storeCode) ?? '',
      specs: { pageIndex: 1, pageSize: 100 }
    };
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    this.loading = true;
    this.reportService.CostadjustmentSpeceficItemReport(this.buildRequest()).subscribe({
      next: blob => {
        if (this.currentPdfObjectUrl) {
          URL.revokeObjectURL(this.currentPdfObjectUrl);
        }
        const url = window.URL.createObjectURL(blob);
        this.currentPdfObjectUrl = url;
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.ExcelReportFlag = 1;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  downloadExcel(): void {
    this.reportService.ExcelReport_CostadjustmentSpeceficItemReport(this.buildRequest()).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ItemsReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  ngOnDestroy(): void {
    if (this.currentPdfObjectUrl) {
      URL.revokeObjectURL(this.currentPdfObjectUrl);
    }
  }
}
