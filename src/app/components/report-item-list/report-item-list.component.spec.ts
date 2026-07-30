import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportItemListComponent } from './report-item-list.component';

describe('ReportItemListComponent', () => {
  let component: ReportItemListComponent;
  let fixture: ComponentFixture<ReportItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportItemListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
