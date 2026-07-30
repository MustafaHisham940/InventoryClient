import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { DetailedItemSalesReportRequest } from '../../core/interfaces/detailed-item-sales-report';

@Component({
  selector: 'app-report-detailed-item-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-detailed-item-sales.component.html',
  styleUrl: './report-detailed-item-sales.component.css'
})
export class ReportDetailedItemSalesComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);

  itemCode: string = '';
  storeCode: string = '';
  startDate: string = '';
  endDate: string = '';

  singleStoreCode: string | undefined;
  singleStoreName: string | undefined;
  multiStoreFlag: string | undefined;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  private lastReqBody?: DetailedItemSalesReportRequest;

  ngOnInit(): void {
    this.multiStoreFlag = this._TokenService.GetUserStoreSettings()?.MultiStore;
    this.singleStoreCode = this._TokenService.GetUserStoreSettings()?.SingleStoreCode;
    this.singleStoreName = this._TokenService.GetUserStoreSettings()?.SingleStoreName;
  }

  hasItemCodeError(): boolean {
    return !this.itemCode?.trim();
  }

  hasStoreCodeError(): boolean {
    return !this.storeCode?.trim();
  }

  hasStartDateError(): boolean {
    return !this.startDate?.trim();
  }

  hasEndDateError(): boolean {
    return !this.endDate?.trim();
  }

  isFormInvalid(): boolean {
    return this.hasItemCodeError()
      || this.hasStoreCodeError()
      || this.hasStartDateError()
      || this.hasEndDateError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: DetailedItemSalesReportRequest = {
      itemCode: this.itemCode,
      storeCode: this.storeCode,
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

    this.reportService.getDetailedItemSalesReport(reqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelReportFlag = 1;
    });
  }

  downloadExcel(): void {
    if (!this.lastReqBody) {
      return;
    }

    this.reportService.ExcelReport_getDetailedItemSalesReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DetailedItemSalesReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
