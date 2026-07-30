import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';

import { RouterOutlet, RouterLink } from '@angular/router';
import { ReportCostControlComponent } from '../report-cost-control/report-cost-control.component';
import { ReportItemsCardComponent } from '../report-items-card/report-items-card.component';
import { MatIcon } from "@angular/material/icon";
import { CheckupBalComponent } from "../checkup-bal/checkup-bal.component";
import { ReportsComponent } from "../reports/reports.component";


@Component({
  selector: 'app-all-reports',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, RouterLink, RouterOutlet, ReportCostControlComponent, ReportItemsCardComponent, RouterLink, MatIcon, CheckupBalComponent, ReportsComponent],
  templateUrl: './all-reports.component.html',
  styleUrl: './all-reports.component.css'
})
export class AllReportsComponent {
  showFiller = false;
  currentRepCode :number=-1



  chooseReport(RepCode:number){
    this.currentRepCode=RepCode

  }
}
