import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { HeaderServiceService } from '../../../core/header-service.service';
import { TokenService } from '../../../core/services/token.service';
import { CanComponentDeactivate } from '../../../core/guards/unsaved-changes-guard.guard';
import { Header } from '../../../core/interfaces/ivDtls';
import { PERSONAL_WITHDRWAL_TRSTY } from '../personal-withdrwal.constants';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { dateToIso, isoToDate } from '../../../core/utils/date-iso';

@Component({
  selector: 'app-personal-withdrwal-edite',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatMenuModule, MatButtonModule, MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './personal-withdrwal-edite.component.html',
  styleUrl: './personal-withdrwal-edite.component.css'
})
export class PersonalWithdrwalEditeComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private _HeaderServiceService: HeaderServiceService,
    private _TokenService: TokenService,
    private _toastrService: ToastrService,
    private _route: Router
  ) { }

  isSaved = false;
  hdr!: Header;
  cur_StoreName!: string;

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
    trsDt: [null, [Validators.required]],
    val: [null, [Validators.required]],
    rem: [null]
  });

  ngOnInit(): void {
    const navigationState = history.state;
    if (!navigationState || !navigationState.data || !navigationState.data.hdr) {
      this._route.navigate(['/home']);
      return;
    }

    this.hdr = navigationState.data.hdr;
    this.cur_StoreName = navigationState.data.cur_StoreName;

    this.form.patchValue({
      trsDt: isoToDate(this.hdr.trsDt ? String(this.hdr.trsDt) : null),
      val: this.hdr.val,
      rem: this.hdr.rem
    });
  }

  private navigateBackToMain(): void {
    this._route.navigate(['/personalWithdrwalMain'], {
      state: {
        data: {
          store_id: { id: this.hdr.strCd, strNm: this.cur_StoreName },
          _TrsTy: PERSONAL_WITHDRWAL_TRSTY,
          StateType: 2
        }
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._toastrService.error('تعديل سند', 'برجاء استكمال تاريخ السند والمبلغ', { positionClass: 'toast-center-center' });
      return;
    }

    const updateData = {
      trsDt: this.form.get('trsDt')?.value ? dateToIso(this.form.get('trsDt')?.value) : null,
      val: this.form.get('val')?.value,
      rem: this.form.get('rem')?.value,
      lUsr: this._TokenService.getGivenName(),
      lTm: new Date()
    };

    this._HeaderServiceService.EditeHeadersData(updateData, this.hdr.strCd!, this.hdr.trsTy, this.hdr.trsNo).subscribe({
      next: () => {
        this.isSaved = true;
        this._toastrService.success('تعديل سند', 'تم تعديل سند المسحوبات الشخصية بنجاح', { positionClass: 'toast-center-center' });
        this.navigateBackToMain();
      },
      error: () => {
        this._toastrService.error('تعديل سند', 'حدث خطأ اثناء تعديل السند', { positionClass: 'toast-center-center' });
      }
    });
  }

  cancel(): void {
    this.isSaved = true;
    this.navigateBackToMain();
  }
}
