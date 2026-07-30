import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportItemsCardComponent } from './report-items-card.component';

describe('ReportItemsCardComponent', () => {
  let component: ReportItemsCardComponent;
  let fixture: ComponentFixture<ReportItemsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportItemsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportItemsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
