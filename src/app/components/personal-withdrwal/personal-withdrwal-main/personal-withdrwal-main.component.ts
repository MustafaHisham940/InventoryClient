import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HDetailsService } from '../../../core/hdetails.service';
import { HeaderServiceService } from '../../../core/header-service.service';
import { IHeaders, Header } from '../../../core/interfaces/ivDtls';
import { DeleteAllHeadersObj } from '../../../core/interfaces/HdrData';
import { PERSONAL_WITHDRWAL_TRSTY } from '../personal-withdrwal.constants';

@Component({
  selector: 'app-personal-withdrwal-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-withdrwal-main.component.html',
  styleUrl: './personal-withdrwal-main.component.css'
})
export class PersonalWithdrwalMainComponent implements OnInit {

  constructor(
    private _HDetailsService: HDetailsService,
    private _HeaderServiceService: HeaderServiceService,
    private _route: Router,
    private _toastrService: ToastrService
  ) { }

  readonly TrsTy = PERSONAL_WITHDRWAL_TRSTY;
  curr_Store!: string;
  curr_StoreName!: string;

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
    const navigationState = history.state;
    if (navigationState
      && navigationState.data
      && navigationState.data.store_id?.id
      && navigationState.data._TrsTy
      && navigationState.data.store_id?.strNm
      && navigationState.data.StateType == 2) {
      this.curr_Store = navigationState.data.store_id.id;
      this.curr_StoreName = navigationState.data.store_id.strNm;
    } else {
      this._route.navigate(['/home']);
      return;
    }

    this.loadHeaders();
  }

  loadHeaders(): void {
    const params: any = {
      f_StrCd_name: this.curr_Store,
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
    this._route.navigate(['/personalWithdrwalAddnew'], {
      state: {
        data: {
          StrCd: this.curr_Store,
          StoreName: this.curr_StoreName,
          TrsTy: this.TrsTy
        }
      }
    });
  }

  goToEdit(hdr: Header): void {
    this._route.navigate(['/personalWithdrwalEdite'], {
      state: {
        data: {
          hdr,
          cur_StoreName: this.curr_StoreName
        }
      }
    });
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
          this._toastrService.success('حذف السند', 'تم حذف سند المسحوبات الشخصية بنجاح');
        }
        this.headerPendingDelete = null;
        this.loadHeaders();
      },
      error: () => {
        this._toastrService.error('حذف السند', 'حدث خطأ اثناء حذف السند');
        this.headerPendingDelete = null;
      }
    });
  }
}
