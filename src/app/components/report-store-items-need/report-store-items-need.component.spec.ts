import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStoreItemsNeedComponent } from './report-store-items-need.component';

describe('ReportStoreItemsNeedComponent', () => {
  let component: ReportStoreItemsNeedComponent;
  let fixture: ComponentFixture<ReportStoreItemsNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportStoreItemsNeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportStoreItemsNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
