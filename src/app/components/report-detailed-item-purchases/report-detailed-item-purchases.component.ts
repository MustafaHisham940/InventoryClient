import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { DetailedItemSalesReportRequest } from '../../core/interfaces/detailed-item-sales-report';
import { ItemPickerComponent } from '../item-picker/item-picker.component';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso } from '../../core/utils/date-iso';
import { ReportShellComponent } from '../report-shared/report-shell.component';
import { StoreScopeFieldComponent } from '../report-shared/store-scope-field.component';

@Component({
  selector: 'app-report-detailed-item-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemPickerComponent, MatDatepickerModule, ReportShellComponent, StoreScopeFieldComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './report-detailed-item-purchases.component.html'
})
export class ReportDetailedItemPurchasesComponent {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  itemCode: string = '';
  itemName: string = '';
  itemCodeTouched: boolean = false;

  /** a single-store user starts locked on their own store, a multi-store user must pick one */
  storeCode: string | null = this.storeScope.initialCode(false);

  /* dd/mm/yyyy date pickers - see DdMmYyyyDateAdapter. The pickers work with Date objects,
   * the request carries yyyy-mm-dd strings. */
  startDateObj: Date | null = null;
  endDateObj: Date | null = null;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  loading = false;
  private lastReqBody?: DetailedItemSalesReportRequest;

  onItemPicked(selection: { itemCode: string, itemName: string }): void {
    this.itemCode = selection.itemCode;
    this.itemName = selection.itemName;
    this.itemCodeTouched = true;
  }

  hasItemCodeError(): boolean {
    return !this.itemCode?.trim();
  }

  hasStoreCodeError(): boolean {
    return this.storeScope.storeError(this.storeCode, false);
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
    return this.hasItemCodeError()
      || this.hasStoreCodeError()
      || this.hasStartDateError()
      || this.hasEndDateError()
      || this.hasDateOrderError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: DetailedItemSalesReportRequest = {
      itemCode: this.itemCode,
      storeCode: this.storeScope.effectiveCode(this.storeCode) ?? '',
      startDate: dateToIso(this.startDateObj!),
      endDate: dateToIso(this.endDateObj!),
      sysInfo: this.storeScope.sysInfo()
    };

    this.lastReqBody = reqBody;
    this.loading = true;

    this.reportService.getDetailedItemPurchasesReport(reqBody).subscribe({
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

    this.reportService.ExcelReport_getDetailedItemPurchasesReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DetailedItemPurchacesReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
