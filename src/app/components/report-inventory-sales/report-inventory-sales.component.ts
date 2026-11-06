import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { InventorySalesReportRequest } from '../../core/interfaces/inventory-sales-report';
import { StoresService } from '../../core/services/stores.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';

@Component({
  selector: 'app-report-inventory-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './report-inventory-sales.component.html',
  styleUrl: './report-inventory-sales.component.css'
})
export class ReportInventorySalesComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);
  private _StoresService = inject(StoresService);

  startDate: string = '';
  endTime: string = '';
  storeCode: any = null;
  startItemCode: string = '';
  endItemCode: string = '';
  storesList: { strCd: string, strNm: string }[] = [];

  /* dd/mm/yyyy date pickers - see DdMmYyyyDateAdapter for why this is needed
   * instead of native <input type="date"> (its display format ignores `lang`
   * and just follows OS/browser locale). Picker works with Date objects;
   * startDate/endTime stay the same ISO yyyy-mm-dd strings the report API expects. */
  startDateObj: Date | null = null;
  endTimeObj: Date | null = null;

  private dateToIso(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  onStartDateObjChange(date: Date | null): void {
    this.startDate = date ? this.dateToIso(date) : '';
  }

  onEndTimeObjChange(date: Date | null): void {
    this.endTime = date ? this.dateToIso(date) : '';
  }

  singleStoreCode: string | undefined;
  singleStoreName: string | undefined;
  multiStoreFlag: string | undefined;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  private lastReqBody?: InventorySalesReportRequest;

  ngOnInit(): void {
    this.multiStoreFlag = this._TokenService.GetUserStoreSettings()?.MultiStore;
    this.singleStoreCode = this._TokenService.GetUserStoreSettings()?.SingleStoreCode;
    this.singleStoreName = this._TokenService.GetUserStoreSettings()?.SingleStoreName;

    this._StoresService.GetStoresLookupList().subscribe({
      next: (res) => {
        this.storesList = res.data;
      }
    });
  }

  hasStartDateError(): boolean {
    return !this.startDate?.trim();
  }

  hasEndTimeError(): boolean {
    return !this.endTime?.trim();
  }

  hasStoreCodeError(): boolean {
    // storeCode is legitimately null when "جمع المخازن" (all stores) is picked -
    // only an unselected (empty string) dropdown counts as an error.
    return this.storeCode === '';
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
    
      || this.hasStartItemCodeError()
      || this.hasEndItemCodeError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: InventorySalesReportRequest = {
      startDate: this.startDate,
      endTime: this.endTime,
      storeCode: this.storeCode??null,
      startItemCode: this.startItemCode,
      endItemCode: this.endItemCode,
      sysInfo: {
        accptMinus: 0,
        multiStore: this.multiStoreFlag === 'True',
        singleStrCd: this.singleStoreCode ?? '',
        companyName: '',
        storeName: this.singleStoreName ?? ''
      }
    };

    this.lastReqBody = reqBody;

    this.reportService.getInventorySalesReport(reqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelReportFlag = 1;
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
