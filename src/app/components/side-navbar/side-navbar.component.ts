import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NavbarHoverDirective } from '../../core/directives/navbar-hover.directive';


import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { CollapseDirective } from '../../core/directives/collapse.directive';


@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule , RouterLinkActive , RouterLink,
   RouterModule ,NavbarHoverDirective
   ,MatButtonModule, MatMenuModule, MatIconModule,
    CollapseDirective
  ],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.css',
  animations: [
    trigger('slideInOut', [
      state('collapsed', style({ width: '70px' })),
      state('expanded', style({ width: '250px' })),
      transition('collapsed <=> expanded', [
        animate('300ms cubic-bezier(.4,0,.2,1)')
      ]),
    ])
  ],
})
export class SideNavbarComponent {
  isCollapsed = true; 

  navState: 'collapsed' | 'expanded' = 'collapsed';

  toggleNav() {
    this.navState = this.navState === 'collapsed' ? 'expanded' : 'collapsed';
  }
  onNavItemClick(event: Event) {
    this.toggleNav();
    // Optionally, if you want to prevent navigation for demonstration:
     event.preventDefault();
  }

  collapseState = {
    first: true,
    second: true,  // Starts expanded
    third: true,
    fourth:true,
    fifth:true
  };

  
}
