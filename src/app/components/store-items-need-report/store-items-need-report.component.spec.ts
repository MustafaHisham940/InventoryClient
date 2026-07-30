import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreItemsNeedReportComponent } from './store-items-need-report.component';

describe('StoreItemsNeedReportComponent', () => {
  let component: StoreItemsNeedReportComponent;
  let fixture: ComponentFixture<StoreItemsNeedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreItemsNeedReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreItemsNeedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
