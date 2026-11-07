import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { CustomerItemsSalesReportRequest } from '../../core/interfaces/customer-items-sales-report';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso } from '../../core/utils/date-iso';
import { ReportShellComponent } from '../report-shared/report-shell.component';

@Component({
  selector: 'app-report-customer-items-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, ReportShellComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './report-customer-items-sales.component.html'
})
export class ReportCustomerItemsSalesComponent {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  startItem: string = '';
  endItem: string = '';

  /* dd/mm/yyyy date pickers - see DdMmYyyyDateAdapter. The pickers work with Date objects,
   * the request carries yyyy-mm-dd strings. */
  startDateObj: Date | null = null;
  endDateObj: Date | null = null;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  loading = false;
  private lastReqBody?: CustomerItemsSalesReportRequest;

  hasStartItemError(): boolean {
    return !this.startItem?.trim();
  }

  hasEndItemError(): boolean {
    return !this.endItem?.trim();
  }

  hasStartDateError(): boolean {
    return !this.startDateObj;
  }

  hasEndDateError(): boolean {
    return !this.endDateObj;
  }

  hasDateOrderError(): boolean {
    return !!this.startDateObj && !!this.endDateObj && this.startDateObj > this.endDateObj;
  }

  isFormInvalid(): boolean {
    return this.hasStartItemError()
      || this.hasEndItemError()
      || this.hasStartDateError()
      || this.hasEndDateError()
      || this.hasDateOrderError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: CustomerItemsSalesReportRequest = {
      startItem: this.startItem,
      endItem: this.endItem,
      startDate: dateToIso(this.startDateObj!),
      endDate: dateToIso(this.endDateObj!),
      sysInfo: this.storeScope.sysInfo()
    };

    this.lastReqBody = reqBody;
    this.loading = true;

    this.reportService.getCustomerItemsSalesReport(reqBody).subscribe({
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

    this.reportService.ExcelReport_getCustomerItemsSalesReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CustomersItemsSalesReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
