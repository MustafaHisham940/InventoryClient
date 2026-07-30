import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { ClientSalesDetailedReportRequest } from '../../core/interfaces/client-sales-detailed-report';

@Component({
  selector: 'app-client-purchases-detailed-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-purchases-detailed-report.component.html',
  styleUrl: './client-purchases-detailed-report.component.css'
})
export class ClientPurchasesDetailedReportComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);

  cstmrCode: number | null = null;
  startDate: string = '';
  endDate: string = '';

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
