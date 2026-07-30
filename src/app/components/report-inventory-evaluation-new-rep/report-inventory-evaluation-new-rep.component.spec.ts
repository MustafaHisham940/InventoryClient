import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInventoryEvaluationNewRepComponent } from './report-inventory-evaluation-new-rep.component';

describe('ReportInventoryEvaluationNewRepComponent', () => {
  let component: ReportInventoryEvaluationNewRepComponent;
  let fixture: ComponentFixture<ReportInventoryEvaluationNewRepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportInventoryEvaluationNewRepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportInventoryEvaluationNewRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
