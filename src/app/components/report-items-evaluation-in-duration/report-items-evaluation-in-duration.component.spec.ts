import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportItemsEvaluationInDurationComponent } from './report-items-evaluation-in-duration.component';

describe('ReportItemsEvaluationInDurationComponent', () => {
  let component: ReportItemsEvaluationInDurationComponent;
  let fixture: ComponentFixture<ReportItemsEvaluationInDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportItemsEvaluationInDurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportItemsEvaluationInDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
