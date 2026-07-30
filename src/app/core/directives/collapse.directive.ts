import { Directive, ElementRef, Input, Renderer2, HostBinding, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appCollapse]',
  standalone: true
})
export class CollapseDirective implements OnDestroy {
  @Input() set appCollapse(value: boolean) {
    if (this._isCollapsed !== value) {
      this._isCollapsed = value;
      this.updateCollapseState();
    }
  }
  private _isCollapsed = false;

  @HostBinding('style.display') display = 'block';
  @HostBinding('style.overflow') overflow = 'hidden';
  @HostBinding('style.transition') transition = 'all 300ms ease-in-out';

  private resizeObserver: ResizeObserver;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.resizeObserver = new ResizeObserver(() => {
      if (!this._isCollapsed) {
        this.updateHeight();
      }
    });
    this.resizeObserver.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
  }

  private updateCollapseState() {
    if (this._isCollapsed) {
      this.renderer.setStyle(this.el.nativeElement, 'height', '0');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
      this.renderer.setStyle(this.el.nativeElement, 'visibility', 'hidden');
    } else {
      this.updateHeight();
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
      this.renderer.setStyle(this.el.nativeElement, 'visibility', 'visible');
    }
  }

  private updateHeight() {
    this.renderer.setStyle(
      this.el.nativeElement, 
      'height', 
      `${this.el.nativeElement.scrollHeight}px`
    );
  }
}