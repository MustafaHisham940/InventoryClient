import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { InventoryEvaluationReportRequest } from '../../core/interfaces/inventory-evaluation-report';
import { ReportShellComponent } from '../report-shared/report-shell.component';
import { StoreScopeFieldComponent } from '../report-shared/store-scope-field.component';

@Component({
  selector: 'app-report-inventory-evaluation-new-rep',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportShellComponent, StoreScopeFieldComponent],
  templateUrl: './report-inventory-evaluation-new-rep.component.html'
})
export class ReportInventoryEvaluationNewRepComponent {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  startItem: string = '';
  endItem: string = '';
  /** a single-store user starts locked on their own store, a multi-store user must pick one */
  storeCode: string | null = this.storeScope.initialCode(false);

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  loading = false;
  private lastReqBody?: InventoryEvaluationReportRequest;

  hasStartItemError(): boolean {
    return !this.startItem?.trim();
  }

  hasEndItemError(): boolean {
    return !this.endItem?.trim();
  }

  hasStoreCodeError(): boolean {
    return this.storeScope.storeError(this.storeCode, false);
  }

  isFormInvalid(): boolean {
    return this.hasStartItemError() || this.hasEndItemError() || this.hasStoreCodeError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: InventoryEvaluationReportRequest = {
      startItem: this.startItem,
      endItem: this.endItem,
      storeCode: this.storeScope.effectiveCode(this.storeCode) ?? '',
      sysInfo: this.storeScope.sysInfo()
    };

    this.lastReqBody = reqBody;
    this.loading = true;

    this.reportService.getInventoryEvaluationReport(reqBody).subscribe({
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

    this.reportService.ExcelReport_getInventoryEvaluationReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'InventoryEvaluationReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
