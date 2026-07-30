import { Component, HostListener, inject, OnInit, signal, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { HDetailsService } from '../../../core/hdetails.service';
import { TokenService } from '../../../core/services/token.service';
import { DialogOverviewExampleDialog } from '../../dynamic-transactions/dynamic-transactions.component';
import { CanComponentDeactivate } from '../../../core/guards/unsaved-changes-guard.guard';
import { EXPENSES_TRSTY } from '../expenses.constants';

@Component({
  selector: 'app-expenses-addnew',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatMenuModule, MatButtonModule, forwardRef(() => DialogOverviewExampleDialog)],
  templateUrl: './expenses-addnew.component.html',
  styleUrl: './expenses-addnew.component.css'
})
export class ExpensesAddnewComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private _HDetailsService: HDetailsService,
    private _TokenService: TokenService,
    private _toastrService: ToastrService,
    private _route: Router
  ) { }

  isSaved = false;
  storeData!: { StrCd: string; StoreName: string; TrsTy: number };

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.isSaved) {
      event.preventDefault();
      event.returnValue = true;
    }
  }

  canDeactivate(): boolean {
    if (!this.isSaved) {
      return confirm('لم يتم حفظ البيانات بعد , هل تريد الخروج بدون حفظ؟');
    }
    return true;
  }

  selectedCustomerId = signal<number>(0);
  selectedCustomerName = signal<string>('');

  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    trsNo: [null, [Validators.required]],
    trsDt: [null, [Validators.required]],
    cstId: [null, [Validators.required, Validators.min(1)]],
    val: [null, [Validators.required]],
    rem: [null]
  });

  ngOnInit(): void {
    const navigationState = history.state;
    if (!navigationState || !navigationState.data) {
      this._route.navigate(['/home']);
      return;
    }
    this.storeData = navigationState.data;

    this._HDetailsService.getMaxHeadersTrsNo({
      strCd: this.storeData.StrCd,
      trsTy: EXPENSES_TRSTY
    }).subscribe({
      next: (res: number) => {
        this.form.get('trsNo')?.setValue(res);
      }
    });
  }

  readonly dialog = inject(MatDialog);
  openCustomerDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {
        S_CstID: this.selectedCustomerId(),
        S_CstName: this.selectedCustomerName()
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.selectedCustomerId.set(result.S_CstID);
      this.selectedCustomerName.set(result.S_CstName);
      this.form.patchValue({ cstId: result.S_CstID });
    });
  }

  private navigateBackToMain(): void {
    this._route.navigate(['/ExpensesMain'], {
      state: {
        data: {
          store_id: { id: this.storeData.StrCd, strNm: this.storeData.StoreName },
          _TrsTy: EXPENSES_TRSTY,
          StateType: 2
        }
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._toastrService.error('اضافة سند', 'برجاء استكمال رقم الفاتورة وتاريخ الفاتورة والعميل والمبلغ');
      return;
    }

    const newHeader = {
      strCd: this.storeData.StrCd,
      trsTy: EXPENSES_TRSTY,
      trsNo: this.form.get('trsNo')?.value,
      trsDt: this.form.get('trsDt')?.value,
      cstId: this.form.get('cstId')?.value,
      val: this.form.get('val')?.value,
      rem: this.form.get('rem')?.value,
      oWn: this._TokenService.getGivenName()
    };

    this._HDetailsService.AddNewHeaders(newHeader).subscribe({
      next: () => {
        this.isSaved = true;
        this._toastrService.success('اضافة سند', 'تمت اضافة سند المصروفات بنجاح');
        this.navigateBackToMain();
      },
      error: (err) => {
        this._toastrService.error('اضافة سند', err?.error?.Errors?.join(' , ') || 'حدث خطأ اثناء اضافة السند');
      }
    });
  }

  cancel(): void {
    this.isSaved = true;
    this.navigateBackToMain();
  }
}
