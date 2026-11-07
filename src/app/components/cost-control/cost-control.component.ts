import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from '../../core/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, finalize, switchMap, tap } from 'rxjs';
import { CostAdjustmentStoreItem } from '../../core/interfaces/CostControl';
import { SlidingNotificationComponent } from "../sliding-notification/sliding-notification.component";

/** one item / store pair whose cost is waiting to be adjusted (names come from the API when it knows them) */
interface PendingCostItem {
  strcd: string;
  itmcd: string;
  strNm?: string | null;
  itmNm?: string | null;
}

@Component({
  selector: 'app-cost-control',
  standalone: true,
  imports: [CommonModule, FormsModule, SlidingNotificationComponent],
  templateUrl: './cost-control.component.html',
  styleUrl: './cost-control.component.css'
})
export class CostControlComponent implements OnInit {

  constructor(private _ReportService: ReportService, private _ToastrService: ToastrService, private _route: Router) { }

  items: PendingCostItem[] = [];
  loading = true;
  loadFailed = false;

  // filters + paging (the whole list comes in one call, so both are done here)
  search = '';
  storeFilter = '';
  readonly pageSize = 10;
  currentPage = 1;

  /** "store|item" keys that are being adjusted right now (their button shows a spinner) */
  private busy = new Set<string>();

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.loadFailed = false;
    this._ReportService.getAllItemsNeedAdjustCost().subscribe({
      next: (res) => {
        this.setItems(res);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadFailed = true;
      }
    });
  }

  private setItems(res: unknown): void {
    this.items = Array.isArray(res) ? res as PendingCostItem[] : [];
    this.currentPage = Math.min(this.currentPage, this.pagesCount);
  }

  retry(): void {
    this.load();
  }

  // ---------- derived lists ----------

  /** distinct stores in the pending list, for the store filter */
  get stores(): { code: string, name: string }[] {
    const seen = new Map<string, string>();
    this.items.forEach(i => { if (!seen.has(i.strcd)) seen.set(i.strcd, i.strNm || i.strcd); });
    return [...seen].map(([code, name]) => ({ code, name }));
  }

  get filtered(): PendingCostItem[] {
    const q = this.search.trim().toLowerCase();
    return this.items.filter(i =>
      (!this.storeFilter || i.strcd === this.storeFilter) &&
      (!q || [i.strcd, i.itmcd, i.strNm, i.itmNm].some(v => (v ?? '').toLowerCase().includes(q))));
  }

  get pagesCount(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get paged(): PendingCostItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pagesCount }, (_, i) => i + 1);
  }

  get showingFrom(): number {
    return this.filtered.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.filtered.length);
  }

  get storesCount(): number {
    return this.stores.length;
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.search = '';
    this.storeFilter = '';
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.pagesCount);
  }

  // ---------- actions ----------

  private key(strcd: string, itmcd: string): string {
    return `${strcd}|${itmcd}`;
  }

  isBusy(item: PendingCostItem): boolean {
    return this.busy.has(this.key(item.strcd, item.itmcd));
  }

  UpdateAllItemsNeedsCostControl() {
    // navigate to the dedicated screen that runs the adjustment
    // item-by-item with a live progress bar, instead of firing the
    // bulk endpoint inline from this page.
    this._route.navigate(['/CostControlAllItems']);
  }

  /** adjusts the cost of one item in one store, then refreshes the pending list */
  UpdateSpecificItem(_Strcd: string, _Itemcd: string) {
    const key = this.key(_Strcd, _Itemcd);
    if (this.busy.has(key)) {
      return;
    }
    this.busy.add(key);

    const localData: CostAdjustmentStoreItem = {
      ItemCd: _Itemcd,
      StrCd: _Strcd
    };

    this._ReportService.AdjustSpeceficStoreITemCost(localData).pipe(
      tap(res => {
        if (res.isSuccess) {
          this._ToastrService.success(res.message, "ضبط التكلفة", {
            positionClass: 'toast-top-right'
          });
        } else {
          this._ToastrService.warning(res.message ?? 'لم يتم ضبط التكلفة', "ضبط التكلفة");
        }
      }),
      switchMap(res => res.isSuccess ? this._ReportService.getAllItemsNeedAdjustCost() : EMPTY),
      finalize(() => this.busy.delete(key))
    ).subscribe({
      next: (res2) => this.setItems(res2)
    });
  }
}
