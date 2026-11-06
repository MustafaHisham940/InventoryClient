import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ItemsServiceService } from '../../core/services/items-service.service';
import { item } from '../../core/interfaces/iitem';
import { ItemDialogueComponent } from '../Dialouge/item-dialogue/item-dialogue.component';

/**
 * Reusable item picker: a code search box (calls GetItemByIdExactMatch on every
 * keystroke) + a disabled name display box, plus a button that opens
 * app-item-dialogue for browsing/selecting an item. Either path ends by
 * emitting the resolved { itemCode, itemName } pair.
 */
@Component({
  selector: 'app-item-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-picker.component.html',
  styleUrl: './item-picker.component.css'
})
export class ItemPickerComponent {

  @Input() itemCode: string = '';
  @Input() itemName: string = '';

  @Output() itemCodeChange = new EventEmitter<string>();
  @Output() itemNameChange = new EventEmitter<string>();
  /** fires with the final resolved pair, whichever path (typed code or dialog) produced it */
  @Output() itemSelected = new EventEmitter<{ itemCode: string, itemName: string }>();

  private readonly dialog = inject(MatDialog);

  constructor(private _ItemsServiceService: ItemsServiceService) {}

  onItemCodeInput(code: string): void {
    this.itemCode = code;
    this.itemCodeChange.emit(this.itemCode);

    if (!code) {
      this.setSelectedItem(this.itemCode, '');
      return;
    }

    this._ItemsServiceService.getFilteredItemsExactMatch(code).subscribe({
      next: (res) => {
        if (res?.data?.length > 0) {
          const found: item = res.data[0];
          this.setSelectedItem(found.id, found.itmNm);
        } else {
          this.setSelectedItem(this.itemCode, '');
        }
      }
    });
  }

  openItemDialog(): void {
    const dialogRef = this.dialog.open(ItemDialogueComponent, {
      data: { ItemCode: this.itemCode, ItemName: this.itemName, ItemPric: 0 }
    });

    dialogRef.afterClosed().subscribe((result: item | undefined) => {
      if (result) {
        this.setSelectedItem(result.id, result.itmNm);
      }
    });
  }

  private setSelectedItem(code: string, name: string): void {
    this.itemCode = code;
    this.itemName = name;
    this.itemCodeChange.emit(this.itemCode);
    this.itemNameChange.emit(this.itemName);
    this.itemSelected.emit({ itemCode: this.itemCode, itemName: this.itemName });
  }
}
