import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { StoreItemsNeedReportRequest } from '../../core/interfaces/store-items-need-report';

@Component({
  selector: 'app-report-store-items-need',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-store-items-need.component.html',
  styleUrl: './report-store-items-need.component.css'
})
export class ReportStoreItemsNeedComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);

  storeCode: string = '';
  startItem: string = '';
  endtItem: string = '';

  singleStoreCode: string | undefined;
  singleStoreName: string | undefined;
  multiStoreFlag: string | undefined;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  private lastReqBody?: StoreItemsNeedReportRequest;

  ngOnInit(): void {
    this.multiStoreFlag = this._TokenService.GetUserStoreSettings()?.MultiStore;
    this.singleStoreCode = this._TokenService.GetUserStoreSettings()?.SingleStoreCode;
    this.singleStoreName = this._TokenService.GetUserStoreSettings()?.SingleStoreName;
  }

  hasStoreCodeError(): boolean {
    return !this.storeCode?.trim();
  }

  hasStartItemError(): boolean {
    return !this.startItem?.trim();
  }

  hasEndtItemError(): boolean {
    return !this.endtItem?.trim();
  }

  isFormInvalid(): boolean {
    return this.hasStoreCodeError()
      || this.hasStartItemError()
      || this.hasEndtItemError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: StoreItemsNeedReportRequest = {
      storeCode: this.storeCode,
      startItem: this.startItem,
      endtItem: this.endtItem,
      sysInfo: {
        accptMinus: 0,
        multiStore: this.multiStoreFlag === 'True',
        singleStrCd: this.singleStoreCode ?? '',
        companyName: '',
        storeName: this.singleStoreName ?? ''
      }
    };

    this.lastReqBody = reqBody;

    this.reportService.getStoreItemsNeedReport(reqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelReportFlag = 1;
    });
  }

  downloadExcel(): void {
    if (!this.lastReqBody) {
      return;
    }

    this.reportService.ExcelReport_getStoreItemsNeedReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'StoreItemsNeedReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
