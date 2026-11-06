import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { HDetailsService } from '../../../core/hdetails.service';
import { TokenService } from '../../../core/services/token.service';
import { CanComponentDeactivate } from '../../../core/guards/unsaved-changes-guard.guard';
import { PERSONAL_WITHDRWAL_TRSTY } from '../personal-withdrwal.constants';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso, isoToDate } from '../../../core/utils/date-iso';

@Component({
  selector: 'app-personal-withdrwal-addnew',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatMenuModule, MatButtonModule, MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './personal-withdrwal-addnew.component.html',
  styleUrl: './personal-withdrwal-addnew.component.css'
})
export class PersonalWithdrwalAddnewComponent implements OnInit, CanComponentDeactivate {

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

  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    trsNo: [null, [Validators.required]],
    trsDt: [new Date(), [Validators.required]], // defaults to today
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
      trsTy: PERSONAL_WITHDRWAL_TRSTY
    }).subscribe({
      next: (res: number) => {
        this.form.get('trsNo')?.setValue(res);
      }
    });
  }

  private navigateBackToMain(): void {
    this._route.navigate(['/personalWithdrwalMain'], {
      state: {
        data: {
          store_id: { id: this.storeData.StrCd, strNm: this.storeData.StoreName },
          _TrsTy: PERSONAL_WITHDRWAL_TRSTY,
          StateType: 2
        }
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._toastrService.error('اضافة سند', 'برجاء استكمال رقم السند وتاريخ السند والمبلغ', { positionClass: 'toast-center-center' });
      return;
    }

    const newHeader = {
      strCd: this.storeData.StrCd,
      trsTy: PERSONAL_WITHDRWAL_TRSTY,
      trsNo: this.form.get('trsNo')?.value,
      trsDt: this.form.get('trsDt')?.value ? dateToIso(this.form.get('trsDt')?.value) : null,
      val: this.form.get('val')?.value,
      rem: this.form.get('rem')?.value,
      oWn: this._TokenService.getGivenName()
    };

    this._HDetailsService.AddNewHeaders(newHeader).subscribe({
      next: () => {
        this.isSaved = true;
        this._toastrService.success('اضافة سند', 'تمت اضافة سند المسحوبات الشخصية بنجاح', { positionClass: 'toast-center-center' });
        this.navigateBackToMain();
      },
      error: (err) => {
        this._toastrService.error('اضافة سند', err?.error?.Errors?.join(' , ') || 'حدث خطأ اثناء اضافة السند', { positionClass: 'toast-center-center' });
      }
    });
  }

  cancel(): void {
    this.isSaved = true;
    this.navigateBackToMain();
  }
}
