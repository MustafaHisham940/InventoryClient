import { Component } from '@angular/core';
import { SideNavbarComponent } from "../../components/side-navbar/side-navbar.component";
import { RouterOutlet } from '@angular/router';
import { HeaderNavbarComponent } from "../../components/header-navbar/header-navbar.component";
import { TestComponent } from "../../components/test/test.component";
import { NavBarTestComponent } from "../../components/nav-bar-test/nav-bar-test.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SideNavbarComponent, RouterOutlet, HeaderNavbarComponent, TestComponent, NavBarTestComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
