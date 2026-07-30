import { Component } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NavbarHoverDirective } from '../../core/directives/navbar-hover.directive';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CollapseDirective } from '../../core/directives/collapse.directive';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule , RouterLinkActive , RouterLink,
    RouterModule ,NavbarHoverDirective
    ,MatButtonModule, MatMenuModule, MatIconModule,
     CollapseDirective
   ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  animations: [
    trigger('slideInOut', [
      state('collapsed', style({ width: '70px' })),
      state('expanded', style({ width: '300px' })),
      transition('collapsed <=> expanded', [
        animate('300ms cubic-bezier(.4,0,.2,1)')
      ]),
    ])
  ],
})
export class TestComponent {

}
