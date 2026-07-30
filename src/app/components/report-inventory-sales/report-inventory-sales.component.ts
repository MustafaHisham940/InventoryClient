import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { InventorySalesReportRequest } from '../../core/interfaces/inventory-sales-report';

@Component({
  selector: 'app-report-inventory-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-inventory-sales.component.html',
  styleUrl: './report-inventory-sales.component.css'
})
export class ReportInventorySalesComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);

  startDate: string = '';
  endTime: string = '';
  storeCode: string = '';
  startItemCode: string = '';
  endItemCode: string = '';

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
  }

  hasStartDateError(): boolean {
    return !this.startDate?.trim();
  }

  hasEndTimeError(): boolean {
    return !this.endTime?.trim();
  }

  hasStoreCodeError(): boolean {
    return !this.storeCode?.trim();
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
      || this.hasStoreCodeError()
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
      storeCode: this.storeCode,
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
