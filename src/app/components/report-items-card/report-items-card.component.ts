import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ReportService } from '../../core/services/report.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { ItemCheckUpRequest } from '../../core/interfaces/itemCheckup';
import { ItemPickerComponent } from '../item-picker/item-picker.component';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso } from '../../core/utils/date-iso';
import { ReportShellComponent } from '../report-shared/report-shell.component';
import { StoreScopeFieldComponent } from '../report-shared/store-scope-field.component';

@Component({
  selector: 'app-report-items-card',
  standalone: true,
  imports: [FormsModule, CommonModule, ItemPickerComponent, MatDatepickerModule, ReportShellComponent, StoreScopeFieldComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './report-items-card.component.html'
})
export class ReportItemsCardComponent implements OnDestroy {

  private reportService = inject(ReportService);
  private storeScope = inject(StoreScopeService);
  private sanitizer = inject(DomSanitizer);

  /** the request body the report endpoint expects */
  _Icustomfilter: ItemCheckUpRequest = {
    specs: {
      strCd_search: '',
      _TrsTy: 0,
      _TrsNo: 0,
      _LnNo: 0,
      _CstId: 0,
      itmCd_search: '',
      _Qty: 0,
      _Pric: 0,
      _BCd: 0,
      _Bck: 0,
      _ONo: 0,
      _GQty: 0,
      own_search: '',
      lUsr_search: '',
      _Cst: 0,
      _Sort: '',
      _pageIndex: 1,
      _pageSize: 100,
      startDate: '',
      endDate: ''
    },
    sysInfo: {
      accptMinus: 0,
      multiStore: false,
      singleStrCd: '',
      companyName: '',
      storeName: ''
    }
  };

  selectedItemName: string = '';
  itemCodeTouched: boolean = false;

  /** a single-store user starts locked on their own store, a multi-store user must pick one */
  storeCode: string | null = this.storeScope.initialCode(false);

  /* dd/mm/yyyy date pickers - see DdMmYyyyDateAdapter. The pickers work with Date objects,
   * the request carries yyyy-mm-dd strings. */
  startDateObj: Date | null = null;
  endDateObj: Date | null = null;

  pdfUrl?: SafeResourceUrl;
  private currentPdfObjectUrl?: string;
  ExcelReportFlag: number = -1;
  loading = false;

  onItemPicked(selection: { itemCode: string, itemName: string }): void {
    this._Icustomfilter.specs.itmCd_search = selection.itemCode;
    this.selectedItemName = selection.itemName;
    this.itemCodeTouched = true;
  }

  hasItemCodeError(): boolean {
    return !this._Icustomfilter.specs.itmCd_search?.trim();
  }

  hasStoreCodeError(): boolean {
    return this.storeScope.storeError(this.storeCode, false);
  }

  hasStartDateError(): boolean {
    return !this.startDateObj;
  }

  hasEndDateError(): boolean {
    return !this.endDateObj;
  }

  hasDateOrderError(): boolean {
    return !!this.startDateObj && !!this.endDateObj && this.startDateObj > this.endDateObj;
  }

  isFormInvalid(): boolean {
    return this.hasItemCodeError()
      || this.hasStoreCodeError()
      || this.hasStartDateError()
      || this.hasEndDateError()
      || this.hasDateOrderError();
  }

  /** copies the screen's values into the request body */
  private buildRequest(): ItemCheckUpRequest {
    this._Icustomfilter.specs.strCd_search = this.storeScope.effectiveCode(this.storeCode) ?? '';
    this._Icustomfilter.specs.startDate = dateToIso(this.startDateObj!);
    this._Icustomfilter.specs.endDate = dateToIso(this.endDateObj!);
    this._Icustomfilter.specs._pageIndex = 1;
    return this._Icustomfilter;
  }

  search(): void {
    if (this.isFormInvalid()) {
      return;
    }

    this.loading = true;
    this.reportService.getItemCheckUpReport(this.buildRequest()).subscribe({
      next: blob => {
        if (this.currentPdfObjectUrl) {
          URL.revokeObjectURL(this.currentPdfObjectUrl);
        }
        const url = window.URL.createObjectURL(blob);
        this.currentPdfObjectUrl = url;
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.ExcelReportFlag = 1;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  downloadExcel(): void {
    if (this.isFormInvalid()) {
      return;
    }

    this.reportService.ExcelReport_getItemCheckUpReport(this.buildRequest()).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ItemsReport.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  ngOnDestroy(): void {
    if (this.currentPdfObjectUrl) {
      URL.revokeObjectURL(this.currentPdfObjectUrl);
    }
  }
}
