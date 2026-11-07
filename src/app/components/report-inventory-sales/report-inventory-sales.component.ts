import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { InventorySalesReportRequest } from '../../core/interfaces/inventory-sales-report';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso } from '../../core/utils/date-iso';
import { ReportShellComponent } from '../report-shared/report-shell.component';
import { StoreScopeFieldComponent } from '../report-shared/store-scope-field.component';

@Component({
  selector: 'app-report-inventory-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, ReportShellComponent, StoreScopeFieldComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './report-inventory-sales.component.html'
})
export class ReportInventorySalesComponent {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  /* dd/mm/yyyy date pickers - see DdMmYyyyDateAdapter. The pickers work with Date objects,
   * the request carries yyyy-mm-dd strings. */
  startDateObj: Date | null = null;
  endTimeObj: Date | null = null;

  /** null = جميع المخازن (multi-store users); a single-store user is locked on their own store */
  storeCode: string | null = this.storeScope.initialCode(true);
  startItemCode: string = '';
  endItemCode: string = '';

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  loading = false;
  private lastReqBody?: InventorySalesReportRequest;

  hasStartDateError(): boolean {
    return !this.startDateObj;
  }

  hasEndTimeError(): boolean {
    return !this.endTimeObj;
  }

  hasDateOrderError(): boolean {
    return !!this.startDateObj && !!this.endTimeObj && this.startDateObj > this.endTimeObj;
  }

  hasStoreCodeError(): boolean {
    return this.storeScope.storeError(this.storeCode, true);
  }

  hasStartItemCodeError(): boolean {
    return !this.startItemCode?.trim();
  }

  hasEndItemCodeError(): boolean {
    return !this.endItemCode?.trim();
  }

  isFormInvalid(): boolean {
    return this.hasStartDateError()
      || this.hasEndTimeError()
      || this.hasDateOrderError()
      || this.hasStoreCodeError()
      || this.hasStartItemCodeError()
      || this.hasEndItemCodeError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: InventorySalesReportRequest = {
      startDate: dateToIso(this.startDateObj!),
      endTime: dateToIso(this.endTimeObj!),
      storeCode: this.storeScope.effectiveCode(this.storeCode),
      startItemCode: this.startItemCode,
      endItemCode: this.endItemCode,
      sysInfo: this.storeScope.sysInfo()
    };

    this.lastReqBody = reqBody;
    this.loading = true;

    this.reportService.getInventorySalesReport(reqBody).subscribe({
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

    this.reportService.ExcelReport_getInventorySalesReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'InventorySalesReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
