import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CustomersComponent } from './components/customers/customers.component';
import { ItemsComponent } from './components/items/items.component';
import { SideNavbarComponent } from "./components/side-navbar/side-navbar.component";
import { HeaderNavbarComponent } from "./components/header-navbar/header-navbar.component";
import { NgxSpinnerComponent } from 'ngx-spinner';
import { MainComponent } from "./layouts/main/main.component";
import { ReportsComponent } from './components/reports/reports.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterComponent,
    LoginComponent, HomeComponent, CustomersComponent,
    ItemsComponent, SideNavbarComponent, HeaderNavbarComponent, NgxSpinnerComponent, MainComponent,ReportsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'InvintorySys';
}
