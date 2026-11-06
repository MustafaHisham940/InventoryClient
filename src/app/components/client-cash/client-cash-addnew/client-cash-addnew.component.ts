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
import { CLIENT_CASH_STR_CD, CLIENT_CASH_TRSTY } from '../client-cash.constants';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso } from '../../../core/utils/date-iso';

@Component({
  selector: 'app-client-cash-addnew',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatMenuModule, MatButtonModule, forwardRef(() => DialogOverviewExampleDialog), MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './client-cash-addnew.component.html',
  styleUrl: './client-cash-addnew.component.css'
})
export class ClientCashAddnewComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private _HDetailsService: HDetailsService,
    private _TokenService: TokenService,
    private _toastrService: ToastrService,
    private _route: Router
  ) { }

  isSaved = false;

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
    trsDt: [new Date(), [Validators.required]], // defaults to today
    cstId: [null, [Validators.required, Validators.min(1)]],
    val: [null, [Validators.required]],
    rem: [null]
  });

  ngOnInit(): void {
    this._HDetailsService.getMaxHeadersTrsNo({
      strCd: CLIENT_CASH_STR_CD,
      trsTy: CLIENT_CASH_TRSTY
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._toastrService.error('اضافة سند', 'برجاء استكمال رقم السند وتاريخ السند والعميل/المورد والمبلغ', { positionClass: 'toast-center-center' });
      return;
    }

    const newHeader = {
      strCd: CLIENT_CASH_STR_CD,
      trsTy: CLIENT_CASH_TRSTY,
      trsNo: this.form.get('trsNo')?.value,
      trsDt: this.form.get('trsDt')?.value ? dateToIso(this.form.get('trsDt')?.value) : null,
      cstId: this.form.get('cstId')?.value,
      val: this.form.get('val')?.value,
      rem: this.form.get('rem')?.value,
      oWn: this._TokenService.getGivenName()
    };

    this._HDetailsService.AddNewHeaders(newHeader).subscribe({
      next: () => {
        this.isSaved = true;
        this._toastrService.success('اضافة سند', 'تمت اضافة سند تسديد المورد بنجاح', { positionClass: 'toast-center-center' });
        this._route.navigate(['/ClientCashMain']);
      },
      error: (err) => {
        this._toastrService.error('اضافة سند', err?.error?.Errors?.join(' , ') || 'حدث خطأ اثناء اضافة السند', { positionClass: 'toast-center-center' });
      }
    });
  }

  cancel(): void {
    this.isSaved = true;
    this._route.navigate(['/ClientCashMain']);
  }
}
