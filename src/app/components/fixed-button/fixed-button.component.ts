import { Component, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-fixed-button',
  standalone: true,
  imports: [CommonModule],
  template: `
  <button 
    (click)="clickEvent.emit()"
    [@scrollState]="isScrolled ? 'scrolled' : 'normal'"
    class="fixed-button"
  >
  <span class="spanClose">+</span>

  <span *ngIf="!isScrolled" > &nbsp;&nbsp;اضافة </span>
  </button>
`,
styles: [`
  .fixed-button {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: #009EF7;
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
`],
animations: [
  trigger('scrollState', [
    state('normal', style({
      padding: '15px 25px',
      fontSize: '20px',
      borderRadius: '30px'
    })),
    state('scrolled', style({
      padding: '15px 18px',
      fontSize: '30px',
      borderRadius: '25px',
      
    })),
    transition('normal <=> scrolled', animate('200ms ease-in-out'))
  ])
]

})
export class FixedButtonComponent {
  @Input() buttonTitle: string = '';
  @Output() clickEvent = new EventEmitter<void>();
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 100;
  }

}
