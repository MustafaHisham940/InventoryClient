import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailedItemSalesComponent } from './report-detailed-item-sales.component';

describe('ReportDetailedItemSalesComponent', () => {
  let component: ReportDetailedItemSalesComponent;
  let fixture: ComponentFixture<ReportDetailedItemSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDetailedItemSalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportDetailedItemSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
