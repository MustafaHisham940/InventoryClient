import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { TokenService } from '../../core/services/token.service';
import { InventoryEvaluationReportRequest } from '../../core/interfaces/inventory-evaluation-report';

@Component({
  selector: 'app-report-inventory-evaluation-new-rep',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-inventory-evaluation-new-rep.component.html',
  styleUrl: './report-inventory-evaluation-new-rep.component.css'
})
export class ReportInventoryEvaluationNewRepComponent {

  private reportService = inject(ReportService);
  private _TokenService = inject(TokenService);
  private sanitizer = inject(DomSanitizer);

  startItem: string = '';
  endItem: string = '';
  storeCode: string = '';

  singleStoreCode: string | undefined;
  singleStoreName: string | undefined;
  multiStoreFlag: string | undefined;

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  private lastReqBody?: InventoryEvaluationReportRequest;

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

  hasStoreCodeError(): boolean {
    return !this.storeCode?.trim();
  }

  isFormInvalid(): boolean {
    return this.hasStartItemError() || this.hasEndItemError() || this.hasStoreCodeError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: InventoryEvaluationReportRequest = {
      startItem: this.startItem,
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

    this.reportService.getInventoryEvaluationReport(reqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.excelReportFlag = 1;
    });
  }

  downloadExcel(): void {
    if (!this.lastReqBody) {
      return;
    }

    this.reportService.ExcelReport_getInventoryEvaluationReport(this.lastReqBody).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'InventoryEvaluationReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
