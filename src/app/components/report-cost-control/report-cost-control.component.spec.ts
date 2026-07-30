import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCostControlComponent } from './report-cost-control.component';

describe('ReportCostControlComponent', () => {
  let component: ReportCostControlComponent;
  let fixture: ComponentFixture<ReportCostControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCostControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportCostControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
