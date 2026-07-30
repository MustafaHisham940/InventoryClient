import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInventorySalesComponent } from './report-inventory-sales.component';

describe('ReportInventorySalesComponent', () => {
  let component: ReportInventorySalesComponent;
  let fixture: ComponentFixture<ReportInventorySalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportInventorySalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportInventorySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
