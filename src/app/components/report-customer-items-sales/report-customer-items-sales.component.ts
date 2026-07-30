import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { CustomerItemsSalesReportRequest } from '../../core/interfaces/customer-items-sales-report';

@Component({
  selector: 'app-report-customer-items-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-customer-items-sales.component.html',
  styleUrl: './report-customer-items-sales.component.css'
})
export class ReportCustomerItemsSalesComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);

  startItem: string = '';
  endItem: string = '';
  startDate: string = '';
  endDate: string = '';

  singleStoreCode: string | undefined;
  singleStoreName: string | undefined;
  multiStoreFlag: string | undefined;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  private lastReqBody?: CustomerItemsSalesReportRequest;

  ngOnInit(): void {
    this.multiStoreFlag = this._TokenService.GetUserStoreSettings()?.MultiStore;
    this.singleStoreCode = this._TokenService.GetUserStoreSettings()?.SingleStoreCode;
    this.singleStoreName = this._TokenService.GetUserStoreSettings()?.SingleStoreName;
  }

  hasStartItemError(): boolean {
    return !this.startItem?.trim();
  }

  hasEndItemError(): boolean {
    return !this.endItem?.trim();
  }

  hasStartDateError(): boolean {
    return !this.startDate?.trim();
  }

  hasEndDateError(): boolean {
    return !this.endDate?.trim();
  }

  isFormInvalid(): boolean {
    return this.hasStartItemError()
      || this.hasEndItemError()
      || this.hasStartDateError()
      || this.hasEndDateError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: CustomerItemsSalesReportRequest = {
      startItem: this.startItem,
      endItem: this.endItem,
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

    this.reportService.getCustomerItemsSalesReport(reqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelReportFlag = 1;
    });
  }

  downloadExcel(): void {
    if (!this.lastReqBody) {
      return;
    }

    this.reportService.ExcelReport_getCustomerItemsSalesReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CustomersItemsSalesReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
