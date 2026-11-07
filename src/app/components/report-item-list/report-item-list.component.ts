import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { ItemsListReportRequest } from '../../core/interfaces/items-list-report';
import { ReportShellComponent } from '../report-shared/report-shell.component';

@Component({
  selector: 'app-report-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportShellComponent],
  templateUrl: './report-item-list.component.html'
})
export class ReportItemListComponent {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  firstItem: string = '';
  endItem: string = '';

  pdfUrl?: SafeResourceUrl;
  excelReportFlag: number = -1;
  loading = false;
  private lastReqBody?: ItemsListReportRequest;

  hasFirstItemError(): boolean {
    return !this.firstItem?.trim();
  }

  hasEndItemError(): boolean {
    return !this.endItem?.trim();
  }

  isFormInvalid(): boolean {
    return this.hasFirstItemError() || this.hasEndItemError();
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const reqBody: ItemsListReportRequest = {
      firstItem: this.firstItem,
      endItem: this.endItem,
      // the item list is not store specific
      storeCode: '',
      sysInfo: this.storeScope.sysInfo()
    };

    this.lastReqBody = reqBody;
    this.loading = true;

    this.reportService.getItemsListReport(reqBody).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.excelReportFlag = 1;
        this.loading = false;
      },
      error: () => this.loading = false
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
