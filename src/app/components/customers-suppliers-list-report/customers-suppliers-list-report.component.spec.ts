import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersSuppliersListReportComponent } from './customers-suppliers-list-report.component';

describe('CustomersSuppliersListReportComponent', () => {
  let component: CustomersSuppliersListReportComponent;
  let fixture: ComponentFixture<CustomersSuppliersListReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersSuppliersListReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomersSuppliersListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
