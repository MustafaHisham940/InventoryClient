import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { ItemsEvaluationInDurationReportRequest } from '../../core/interfaces/items-evaluation-in-duration-report';

@Component({
  selector: 'app-report-items-evaluation-in-duration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-items-evaluation-in-duration.component.html',
  styleUrl: './report-items-evaluation-in-duration.component.css'
})
export class ReportItemsEvaluationInDurationComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);

  storeCode: string = '';
  startItmCode: string = '';
  endItmCode: string = '';
  startDate: string = '';
  endDate: string = '';

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
