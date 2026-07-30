import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCustomerItemsSalesComponent } from './report-customer-items-sales.component';

describe('ReportCustomerItemsSalesComponent', () => {
  let component: ReportCustomerItemsSalesComponent;
  let fixture: ComponentFixture<ReportCustomerItemsSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCustomerItemsSalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportCustomerItemsSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
