import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HDetailsService } from '../../../core/hdetails.service';
import { HeaderServiceService } from '../../../core/header-service.service';
import { IHeaders, Header } from '../../../core/interfaces/ivDtls';
import { DeleteAllHeadersObj } from '../../../core/interfaces/HdrData';
import { CLIENT_CASH_TRSTY } from '../client-cash.constants';

@Component({
  selector: 'app-client-cash-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-cash-main.component.html',
  styleUrl: './client-cash-main.component.css'
})
export class ClientCashMainComponent implements OnInit {

  constructor(
    private _HDetailsService: HDetailsService,
    private _HeaderServiceService: HeaderServiceService,
    private _route: Router,
    private _toastrService: ToastrService
  ) { }

  readonly TrsTy = CLIENT_CASH_TRSTY;

  filters = {
    cstId: undefined as number | undefined,
    trsDt: '' as string
  };

  Headers: IHeaders = {
    pageSize: 0,
    pageIndex: 0,
    count: 0,
    totalCount: 0,
    data: []
  };

  pagedData: Header[] = [];
  pageSize = 10;
  currentPage = 1;
  mathCiel = 1;

  ngOnInit(): void {
    this.loadHeaders();
  }

  loadHeaders(): void {
    const params: any = {
      f__TrsTy: this.TrsTy,
      _pageSize: 1000,
      _pageIndex: 1
    };
    if (this.filters.cstId) {
      params.f_CstId = this.filters.cstId;
    }
    if (this.filters.trsDt) {
      params.f__TrsDt = new Date(this.filters.trsDt);
    }

    this._HDetailsService.getAllHeadersFiltered(params).subscribe({
      next: (res: IHeaders) => {
        this.Headers = res;
        this.currentPage = 1;
        this.updatePagedData();
      }
    });
  }

  updatePagedData(): void {
    const total = this.Headers.data?.length || 0;
    this.mathCiel = Math.max(1, Math.ceil(total / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedData = (this.Headers.data || []).slice(start, start + this.pageSize);
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.mathCiel) {
      return;
    }
    this.currentPage = newPage;
    this.updatePagedData();
  }

  search(): void {
    this.loadHeaders();
  }

  clearFilters(): void {
    this.filters = { cstId: undefined, trsDt: '' };
    this.loadHeaders();
  }

  goToAdd(): void {
    this._route.navigate(['/ClientCashAddnew']);
  }

  goToEdit(hdr: Header): void {
    this._route.navigate(['/ClientCashEdite'], { state: { data: hdr } });
  }

  headerPendingDelete: Header | null = null;

  clickDelete(hdr: Header): void {
    this.headerPendingDelete = hdr;
  }

  dontDelete(): void {
    this.headerPendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.headerPendingDelete) {
      return;
    }

    const obj: DeleteAllHeadersObj = {
      hdr: {
        strCd: this.headerPendingDelete.strCd,
        trsTy: this.headerPendingDelete.trsTy,
        trsNo: this.headerPendingDelete.trsNo
      },
      sysInfo: {
        accptMinus: Number(sessionStorage.getItem('AcceptMinus')),
        multiStore: false,
        singleStrCd: '',
        companyName: '',
        storeName: ''
      }
    };

    this._HeaderServiceService.deleteHeadersParallel(obj).subscribe({
      next: (res) => {
        if (res?.isWarning === true) {
          this._toastrService.warning('حذف السند', res.errors, {
            closeButton: true,
            enableHtml: true,
            positionClass: 'toast-center-center',
            toastClass: 'ngx-toastr custom-large-toast',
            tapToDismiss: true,
          });
        } else {
          this._toastrService.success('حذف السند', 'تم حذف سند تسديد المورد بنجاح', { positionClass: 'toast-center-center' });
        }
        this.headerPendingDelete = null;
        this.loadHeaders();
      },
      error: () => {
        this._toastrService.error('حذف السند', 'حدث خطأ اثناء حذف السند', { positionClass: 'toast-center-center' });
        this.headerPendingDelete = null;
      }
    });
  }
}
