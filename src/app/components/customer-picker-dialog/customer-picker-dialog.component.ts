import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomerTableSeprateComponent } from '../CustomTables/customer-table-seprate/customer-table-seprate.component';
import { customer } from '../../core/interfaces/icustomer';

/**
 * Thin dialog shell around app-customer-table-seprate: that component only emits
 * (CustomerOutputID) as you pick a row, it has no confirm/cancel of its own - this
 * shell adds those and closes the MatDialog with the picked customer.
 */
@Component({
  selector: 'app-customer-picker-dialog',
  standalone: true,
  imports: [CustomerTableSeprateComponent],
  templateUrl: './customer-picker-dialog.component.html',
  styleUrl: './customer-picker-dialog.component.css'
})
export class CustomerPickerDialogComponent {

  readonly dialogRef = inject(MatDialogRef<CustomerPickerDialogComponent>);

  selectedCustomer: customer | null = null;

  onCustomerReceived(customer: customer): void {
    this.selectedCustomer = customer;
  }

  confirm(): void {
    this.dialogRef.close(this.selectedCustomer);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
