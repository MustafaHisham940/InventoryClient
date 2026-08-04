import { Component, HostListener, inject, OnInit, signal, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { HeaderServiceService } from '../../../core/header-service.service';
import { TokenService } from '../../../core/services/token.service';
import { DialogOverviewExampleDialog } from '../../dynamic-transactions/dynamic-transactions.component';
import { CanComponentDeactivate } from '../../../core/guards/unsaved-changes-guard.guard';
import { Header } from '../../../core/interfaces/ivDtls';

@Component({
  selector: 'app-client-cash-edite',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatMenuModule, MatButtonModule, forwardRef(() => DialogOverviewExampleDialog)],
  templateUrl: './client-cash-edite.component.html',
  styleUrl: './client-cash-edite.component.css'
})
export class ClientCashEditeComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private _HeaderServiceService: HeaderServiceService,
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

  hdr!: Header;
  selectedCustomerId = signal<number>(0);
  selectedCustomerName = signal<string>('');

  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    trsDt: [null, [Validators.required]],
    cstId: [null, [Validators.required, Validators.min(1)]],
    val: [null, [Validators.required]],
    rem: [null]
  });

  ngOnInit(): void {
    const navigationState = history.state;
    if (!navigationState || !navigationState.data) {
      this._route.navigate(['/ClientCashMain']);
      return;
    }

    this.hdr = navigationState.data;
    this.selectedCustomerId.set(this.hdr.cstId);
    this.selectedCustomerName.set(this.hdr.customerName);

    this.form.patchValue({
      trsDt: this.hdr.trsDt ? String(this.hdr.trsDt).substring(0, 10) : null,
      cstId: this.hdr.cstId,
      val: this.hdr.val,
      rem: this.hdr.rem
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
      this._toastrService.error('تعديل سند', 'برجاء استكمال تاريخ السند والعميل/المورد والمبلغ', { positionClass: 'toast-center-center' });
      return;
    }

    const updateData = {
      trsDt: this.form.get('trsDt')?.value,
      cstId: this.form.get('cstId')?.value,
      val: this.form.get('val')?.value,
      rem: this.form.get('rem')?.value,
      lUsr: this._TokenService.getGivenName(),
      lTm: new Date()
    };

    this._HeaderServiceService.EditeHeadersDataNoStore(updateData, this.hdr.trsTy, this.hdr.trsNo).subscribe({
      next: () => {
        this.isSaved = true;
        this._toastrService.success('تعديل سند', 'تم تعديل سند تسديد المورد بنجاح', { positionClass: 'toast-center-center' });
        this._route.navigate(['/ClientCashMain']);
      },
      error: () => {
        this._toastrService.error('تعديل سند', 'حدث خطأ اثناء تعديل السند', { positionClass: 'toast-center-center' });
      }
    });
  }

  cancel(): void {
    this.isSaved = true;
    this._route.navigate(['/ClientCashMain']);
  }
}
