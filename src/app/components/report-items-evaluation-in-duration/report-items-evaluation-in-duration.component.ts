import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { ItemsEvaluationInDurationReportRequest } from '../../core/interfaces/items-evaluation-in-duration-report';
import { StoresService } from '../../core/services/stores.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';

@Component({
  selector: 'app-report-items-evaluation-in-duration',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './report-items-evaluation-in-duration.component.html',
  styleUrl: './report-items-evaluation-in-duration.component.css'
})
export class ReportItemsEvaluationInDurationComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);
  private _StoresService = inject(StoresService);

  storeCode: string = '';
  storesList: { strCd: string, strNm: string }[] = [];
  startItmCode: string = '';
  endItmCode: string = '';
  startDate: string = '';
  endDate: string = '';

  /* dd/mm/yyyy date pickers - see DdMmYyyyDateAdapter for why this is needed
   * instead of native <input type="date"> (its display format ignores `lang`
   * and just follows OS/browser locale). Picker works with Date objects;
   * startDate/endDate stay the same ISO yyyy-mm-dd strings the report API expects. */
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
  private lastReqBody?: ItemsEvaluationInDurationReportRequest;

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

  hasStoreCodeError(): boolean {
    return !this.storeCode?.trim();
  }

  hasStartItmCodeError(): boolean {
    return !this.startItmCode?.trim();
  }

  hasEndItmCodeError(): boolean {
    return !this.endItmCode?.trim();
  }

  hasStartDateError(): boolean {
    return !this.startDate?.trim();
  }

  hasEndDateError(): boolean {
    return !this.endDate?.trim();
  }

  isFormInvalid(): boolean {
    return this.hasStoreCodeError()
      || this.hasStartItmCodeError()
      || this.hasEndItmCodeError()
      || this.hasStartDateError()
      || this.hasEndDateError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: ItemsEvaluationInDurationReportRequest = {
      storeCode: this.storeCode,
      startItmCode: this.startItmCode,
      endItmCode: this.endItmCode,
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

    this.reportService.getItemsEvaluationInDurationReport(reqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelReportFlag = 1;
    });
  }

  downloadExcel(): void {
    if (!this.lastReqBody) {
      return;
    }

    this.reportService.ExcelReport_getItemsEvaluationInDurationReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ItemsEvaluationInDurationReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
