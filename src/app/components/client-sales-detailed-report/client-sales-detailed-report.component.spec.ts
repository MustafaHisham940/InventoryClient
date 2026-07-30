import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSalesDetailedReportComponent } from './client-sales-detailed-report.component';

describe('ClientSalesDetailedReportComponent', () => {
  let component: ClientSalesDetailedReportComponent;
  let fixture: ComponentFixture<ClientSalesDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSalesDetailedReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientSalesDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
