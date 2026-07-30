import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInventoryEvaluationComponent } from './report-inventory-evaluation.component';

describe('ReportInventoryEvaluationComponent', () => {
  let component: ReportInventoryEvaluationComponent;
  let fixture: ComponentFixture<ReportInventoryEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportInventoryEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportInventoryEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
