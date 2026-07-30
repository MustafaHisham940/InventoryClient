import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appNavbarHover]',
  standalone: true
})
export class NavbarHoverDirective {
  private hoverElement: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Create the hover effect element
    this.hoverElement = this.renderer.createElement('div');
    this.renderer.addClass(this.hoverElement, 'navbar-hover-effect');
    
    // Style the hover element
    this.renderer.setStyle(this.hoverElement, 'position', 'absolute');
    this.renderer.setStyle(this.hoverElement, 'background', 'rgba(255, 255, 255, 0.2)');
    this.renderer.setStyle(this.hoverElement, 'border-radius', '4px');
    this.renderer.setStyle(this.hoverElement, 'transition', 'all 0.3s ease');
    this.renderer.setStyle(this.hoverElement, 'pointer-events', 'none');
    
    // Make it initially hidden
    this.renderer.setStyle(this.hoverElement, 'opacity', '0');
    
    // Position it behind the icon
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.appendChild(this.el.nativeElement, this.hoverElement);
  }

  @HostListener('mouseenter') onMouseEnter() {
    // Get icon dimensions
    const iconRect = this.el.nativeElement.getBoundingClientRect();
    const size = Math.max(iconRect.width, iconRect.height) * 1.2; // 20% larger than icon
    
    // Position and size the hover element
    this.renderer.setStyle(this.hoverElement, 'width', `${size}px`);
    this.renderer.setStyle(this.hoverElement, 'height', `${size}px`);
    this.renderer.setStyle(this.hoverElement, 'left', `${(iconRect.width - size) / 2}px`);
    this.renderer.setStyle(this.hoverElement, 'top', `${(iconRect.height - size) / 2}px`);
    
    // Show the hover effect
    this.renderer.setStyle(this.hoverElement, 'opacity', '1');
  }

  @HostListener('mouseleave') onMouseLeave() {
    // Hide the hover effect
    this.renderer.setStyle(this.hoverElement, 'opacity', '0');
  }
}