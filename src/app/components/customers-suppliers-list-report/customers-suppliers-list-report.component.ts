import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { CustomersSuppliersListReportRequest } from '../../core/interfaces/customers-suppliers-list-report';

@Component({
  selector: 'app-customers-suppliers-list-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers-suppliers-list-report.component.html',
  styleUrl: './customers-suppliers-list-report.component.css'
})
export class CustomersSuppliersListReportComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);

  startCstmr: number | null = null;
  endCstmr: number | null = null;
  customerType: number | null = null;

  singleStoreCode: string | undefined;
  singleStoreName: string | undefined;
  multiStoreFlag: string | undefined;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  private lastReqBody?: CustomersSuppliersListReportRequest;

  ngOnInit(): void {
    this.multiStoreFlag = this._TokenService.GetUserStoreSettings()?.MultiStore;
    this.singleStoreCode = this._TokenService.GetUserStoreSettings()?.SingleStoreCode;
    this.singleStoreName = this._TokenService.GetUserStoreSettings()?.SingleStoreName;
  }

  hasStartCstmrError(): boolean {
    return this.startCstmr === null || this.startCstmr === undefined || (this.startCstmr as any) === '';
  }

  hasEndCstmrError(): boolean {
    return this.endCstmr === null || this.endCstmr === undefined || (this.endCstmr as any) === '';
  }

  hasCustomerTypeError(): boolean {
    return this.customerType === null || this.customerType === undefined;
  }

  isFormInvalid(): boolean {
    return this.hasStartCstmrError() || this.hasEndCstmrError() || this.hasCustomerTypeError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: CustomersSuppliersListReportRequest = {
      startCstmr: Number(this.startCstmr),
      endCstmr: Number(this.endCstmr),
      customerType: Number(this.customerType),
      sysInfo: {
        accptMinus: 0,
        multiStore: this.multiStoreFlag === 'True',
        singleStrCd: this.singleStoreCode ?? '',
        companyName: '',
        storeName: this.singleStoreName ?? ''
      }
    };

    this.lastReqBody = reqBody;

    this.reportService.getCustomersSuppliersListReport(reqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelReportFlag = 1;
    });
  }

  downloadExcel(): void {
    if (!this.lastReqBody) {
      return;
    }

    this.reportService.ExcelReport_getCustomersSuppliersListReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CustomersSuppliersListReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
