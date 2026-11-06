import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { ItemsListReportRequest } from '../../core/interfaces/items-list-report';

@Component({
  selector: 'app-report-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-item-list.component.html',
  styleUrl: './report-item-list.component.css'
})
export class ReportItemListComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);

  firstItem: string = '';
  endItem: string = '';
  storeCode: string = '';

  singleStoreCode: string | undefined;
  singleStoreName: string | undefined;
  multiStoreFlag: string | undefined;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  private lastReqBody?: ItemsListReportRequest;

  ngOnInit(): void {
    this.multiStoreFlag = this._TokenService.GetUserStoreSettings()?.MultiStore;
    this.singleStoreCode = this._TokenService.GetUserStoreSettings()?.SingleStoreCode;
    this.singleStoreName = this._TokenService.GetUserStoreSettings()?.SingleStoreName;
  }

  hasFirstItemError(): boolean {
    return !this.firstItem?.trim();
  }

  hasEndItemError(): boolean {
    return !this.endItem?.trim();
  }

 

  isFormInvalid(): boolean {
    return this.hasFirstItemError() || this.hasEndItemError() ;
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: ItemsListReportRequest = {
      firstItem: this.firstItem,
      endItem: this.endItem,
      storeCode: this.storeCode,
      sysInfo: {
        accptMinus: 0,
        multiStore: this.multiStoreFlag === 'True',
        singleStrCd: this.singleStoreCode ?? '',
        companyName: '',
        storeName: this.singleStoreName ?? ''
      }
    };

    this.lastReqBody = reqBody;

    this.reportService.getItemsListReport(reqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelReportFlag = 1;
    });
  }

  downloadExcel(): void {
    if (!this.lastReqBody) {
      return;
    }

    this.reportService.ExcelReport_getItemsListReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ItemsListReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
