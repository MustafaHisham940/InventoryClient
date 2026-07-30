import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportItemBalancesComponent } from './report-item-balances.component';

describe('ReportItemBalancesComponent', () => {
  let component: ReportItemBalancesComponent;
  let fixture: ComponentFixture<ReportItemBalancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportItemBalancesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportItemBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
