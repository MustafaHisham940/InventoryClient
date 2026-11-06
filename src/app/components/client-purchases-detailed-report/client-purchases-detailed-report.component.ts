import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { ClientSalesDetailedReportRequest } from '../../core/interfaces/client-sales-detailed-report';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { CustomerPickerComponent } from '../customer-picker/customer-picker.component';

@Component({
  selector: 'app-client-purchases-detailed-report',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerPickerComponent, MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './client-purchases-detailed-report.component.html',
  styleUrl: './client-purchases-detailed-report.component.css'
})
export class ClientPurchasesDetailedReportComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);

  cstmrCode: number | null = null;
  cstmrCodeText: string = '';
  cstmrName: string = '';
  cstmrCodeTouched: boolean = false;
  startDate: string = '';
  endDate: string = '';

  onCustomerPicked(selection: { customerCode: string, customerName: string }): void {
    this.cstmrCodeText = selection.customerCode;
    this.cstmrName = selection.customerName;
    this.cstmrCode = /^\d+$/.test(selection.customerCode) ? Number(selection.customerCode) : null;
    this.cstmrCodeTouched = true;
  }

  /* dd/mm/yyyy date pickers - see DdMmYyyyDateAdapter for why this is needed
   * instead of native <input type="date"> (its display format ignores `lang`
   * and just follows OS/browser locale). Picker works with Date objects; the
   * model fields stay the same ISO yyyy-mm-dd strings the report API expects. */
  startDateObj: Date | null = null;
  endDateObj: Date | null = null;

  private dateToIso(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  onStartDateObjChange(date: Date | null): void {
    this.startDate = date ? this.dateToIso(date) : '';
  }

  onEndDateObjChange(date: Date | null): void {
    this.endDate = date ? this.dateToIso(date) : '';
  }

  singleStoreCode: string | undefined;
  singleStoreName: string | undefined;
  multiStoreFlag: string | undefined;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  private lastReqBody?: ClientSalesDetailedReportRequest;

  ngOnInit(): void {
    this.multiStoreFlag = this._TokenService.GetUserStoreSettings()?.MultiStore;
    this.singleStoreCode = this._TokenService.GetUserStoreSettings()?.SingleStoreCode;
    this.singleStoreName = this._TokenService.GetUserStoreSettings()?.SingleStoreName;
  }

  hasCstmrCodeError(): boolean {
    return this.cstmrCode === null || this.cstmrCode === undefined || (this.cstmrCode as any) === '';
  }

  hasStartDateError(): boolean {
    return !this.startDate?.trim();
  }

  hasEndDateError(): boolean {
    return !this.endDate?.trim();
  }

  isFormInvalid(): boolean {
    return this.hasCstmrCodeError()
      || this.hasStartDateError()
      || this.hasEndDateError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: ClientSalesDetailedReportRequest = {
      cstmrCode: Number(this.cstmrCode),
      startDate: this.startDate,
      endDate: this.endDate,
      sysInfo: {
        accptMinus: 0,
        multiStore: this.multiStoreFlag === 'True',
        singleStrCd: this.singleStoreCode ?? '',
        companyName: '',
        storeName: this.singleStoreName ?? ''
      }
    };

    this.lastReqBody = reqBody;

    this.reportService.getClientPurchasesDetailedReport(reqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelReportFlag = 1;
    });
  }

  downloadExcel(): void {
    if (!this.lastReqBody) {
      return;
    }

    this.reportService.ExcelReport_getClientPurchasesDetailedReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ClientPurchasesDetailedReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
