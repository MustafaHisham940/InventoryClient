import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { CustomersSuppliersListReportRequest } from '../../core/interfaces/customers-suppliers-list-report';
import { ReportShellComponent } from '../report-shared/report-shell.component';

@Component({
  selector: 'app-customers-suppliers-list-report',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportShellComponent],
  templateUrl: './customers-suppliers-list-report.component.html'
})
export class CustomersSuppliersListReportComponent {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  startCstmr: number | null = null;
  endCstmr: number | null = null;
  customerType: number | null = null;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  loading = false;
  private lastReqBody?: CustomersSuppliersListReportRequest;

  hasStartCstmrError(): boolean {
    return this.startCstmr === null || this.startCstmr === undefined || (this.startCstmr as any) === '';
  }

  hasEndCstmrError(): boolean {
    return this.endCstmr === null || this.endCstmr === undefined || (this.endCstmr as any) === '';
  }

  hasCustomerTypeError(): boolean {
    return this.customerType === null || this.customerType === undefined;
  }

  isFormInvalid(): boolean {
    return this.hasStartCstmrError() || this.hasEndCstmrError() || this.hasCustomerTypeError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: CustomersSuppliersListReportRequest = {
      startCstmr: Number(this.startCstmr),
      endCstmr: Number(this.endCstmr),
      customerType: Number(this.customerType),
      sysInfo: this.storeScope.sysInfo()
    };

    this.lastReqBody = reqBody;
    this.loading = true;

    this.reportService.getCustomersSuppliersListReport(reqBody).subscribe({
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

    this.reportService.ExcelReport_getCustomersSuppliersListReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CustomersSuppliersListReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
