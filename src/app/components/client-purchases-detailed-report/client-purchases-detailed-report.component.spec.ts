import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPurchasesDetailedReportComponent } from './client-purchases-detailed-report.component';

describe('ClientPurchasesDetailedReportComponent', () => {
  let component: ClientPurchasesDetailedReportComponent;
  let fixture: ComponentFixture<ClientPurchasesDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPurchasesDetailedReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientPurchasesDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
