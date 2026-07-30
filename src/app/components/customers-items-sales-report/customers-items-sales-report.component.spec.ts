import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersItemsSalesReportComponent } from './customers-items-sales-report.component';

describe('CustomersItemsSalesReportComponent', () => {
  let component: CustomersItemsSalesReportComponent;
  let fixture: ComponentFixture<CustomersItemsSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersItemsSalesReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomersItemsSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
