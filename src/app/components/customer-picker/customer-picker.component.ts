import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { customer } from '../../core/interfaces/icustomer';
import { CustomerPickerDialogComponent } from '../customer-picker-dialog/customer-picker-dialog.component';

/**
 * Reusable customer/supplier picker: a code search box (calls
 * GetCustomerExactMatchById on every keystroke) + a disabled name display box,
 * plus a button that opens app-customer-table-seprate (via a thin dialog shell,
 * since that component has no confirm button of its own) for browsing/selecting.
 * Either path ends by emitting the resolved { customerCode, customerName } pair.
 */
@Component({
  selector: 'app-customer-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-picker.component.html',
  styleUrl: './customer-picker.component.css'
})
export class CustomerPickerComponent {

  @Input() customerCode: string = '';
  @Input() customerName: string = '';

  @Output() customerCodeChange = new EventEmitter<string>();
  @Output() customerNameChange = new EventEmitter<string>();
  /** fires with the final resolved pair, whichever path (typed code or dialog) produced it */
  @Output() customerSelected = new EventEmitter<{ customerCode: string, customerName: string }>();

  private readonly dialog = inject(MatDialog);

  constructor(private _CustomerServiceService: CustomerServiceService) {}

  onCustomerCodeInput(code: string): void {
    this.customerCode = code;
    this.customerCodeChange.emit(this.customerCode);

    if (!code) {
      this.setSelectedCustomer(this.customerCode, '');
      return;
    }

    this._CustomerServiceService.getCustomerExactMatchById(code).subscribe({
      next: (res) => {
        if (res?.data) {
          this.setSelectedCustomer(String(res.data.customerCode), res.data.customerName ?? '');
        } else {
          this.setSelectedCustomer(this.customerCode, '');
        }
      }
    });
  }

  openCustomerDialog(): void {
    const dialogRef = this.dialog.open(CustomerPickerDialogComponent);

    dialogRef.afterClosed().subscribe((result: customer | undefined) => {
      if (result) {
        this.setSelectedCustomer(String(result.id), result.cstNm);
      }
    });
  }

  private setSelectedCustomer(code: string, name: string): void {
    this.customerCode = code;
    this.customerName = name;
    this.customerCodeChange.emit(this.customerCode);
    this.customerNameChange.emit(this.customerName);
    this.customerSelected.emit({ customerCode: this.customerCode, customerName: this.customerName });
  }
}
