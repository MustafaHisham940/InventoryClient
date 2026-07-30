import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sliding-notification',
  standalone: true,
  imports: [],
  templateUrl: './sliding-notification.component.html',
  styleUrl: './sliding-notification.component.css'
})
export class SlidingNotificationComponent {
  @Input() message = 'You have a new notification.';
  @Input() title = 'Notification';
  @Input() isOpen = false;
  @Input() okText = 'OK';

  // Parent listens to close reason.
  @Output() closed = new EventEmitter<'ok' | 'outside'>();

  isRendered = true;
  isLeaving = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.syncRenderState();
    }
  }

  onBackdropClick(): void {
    this.startClose('outside');
  }

  onCardClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onOkClick(): void {
    this.startClose('ok');
  }

  private syncRenderState(): void {
    if (this.isOpen) {
      this.isRendered = true;
      this.isLeaving = false;
      return;
    }

    if (this.isRendered) {
      this.isLeaving = true;
      window.setTimeout(() => {
        this.isRendered = false;
        this.isLeaving = false;
      }, 320);
    }
  }

  private startClose(reason: 'ok' | 'outside'): void {
    if (!this.isRendered || this.isLeaving) {
      return;
    }

    this.isLeaving = true;
    window.setTimeout(() => {
      this.isRendered = false;
      this.isLeaving = false;
      this.closed.emit(reason);
    }, 320);
  }
}
