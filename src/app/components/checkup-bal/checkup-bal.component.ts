import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ICheckupBalRep } from '../../core/interfaces/icheckup-bal-rep';
import { HDetailsService } from '../../core/hdetails.service';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso } from '../../core/utils/date-iso';
import { CustomerPickerComponent } from '../customer-picker/customer-picker.component';
import { ReportShellComponent } from '../report-shared/report-shell.component';

@Component({
  selector: 'app-checkup-bal',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerPickerComponent, MatDatepickerModule, ReportShellComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './checkup-bal.component.html'
})
export class CheckupBalComponent implements OnDestroy {

  private sanitizer = inject(DomSanitizer);
  private _HDetailsService = inject(HDetailsService);

  /** the request body the report endpoint expects */
  _Icustomfilter: ICheckupBalRep = {
    specs: {
      cstId: undefined,
      startDate: '',
      endDate: '',
      sort: '',
      pageSize: 100,
      pageIndex: 1,
    },
    sysInfo: {
      accptMinus: 0,
      multiStore: false,
      singleStrCd: '',
      companyName: '',
      storeName: ''
    }
  };

  cstIdText: string = '';
  customerName: string = '';
  customerCodeTouched: boolean = false;

  /* dd/mm/yyyy date pickers - see DdMmYyyyDateAdapter. The pickers work with Date objects,
   * the request carries yyyy-mm-dd strings. */
  startDateObj: Date | null = null;
  endDateObj: Date | null = null;

  pdfUrl?: SafeResourceUrl;
  private currentPdfObjectUrl?: string;
  ExcelReportFlag: number = -1;
  loading = false;

  onCustomerPicked(selection: { customerCode: string, customerName: string }): void {
    this.cstIdText = selection.customerCode;
    this.customerName = selection.customerName;
    this._Icustomfilter.specs.cstId = /^\d+$/.test(selection.customerCode) ? Number(selection.customerCode) : undefined;
    this.customerCodeTouched = true;
  }

  hasCustomerCodeError(): boolean {
    const customerCode = this._Icustomfilter.specs.cstId;
    return customerCode === null || customerCode === undefined || `${customerCode}`.trim().length === 0;
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
    return this.hasCustomerCodeError()
      || this.hasStartDateError()
      || this.hasEndDateError()
      || this.hasDateOrderError();
  }

  /** copies the screen's dates into the request body */
  private buildRequest(): ICheckupBalRep {
    this._Icustomfilter.specs.startDate = dateToIso(this.startDateObj!);
    this._Icustomfilter.specs.endDate = dateToIso(this.endDateObj!);
    this._Icustomfilter.specs.pageIndex = 1;
    return this._Icustomfilter;
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    this.loading = true;
    this._HDetailsService.GetHeadersData_Report(this.buildRequest()).subscribe({
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
    if (this.isFormInvalid()) {
      return;
    }

    this._HDetailsService.ExcelReport_GetHeadersData_Report(this.buildRequest()).subscribe(blob => {
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
