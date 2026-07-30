import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPurchacesReportComponent } from './inventory-purchaces-report.component';

describe('InventoryPurchacesReportComponent', () => {
  let component: InventoryPurchacesReportComponent;
  let fixture: ComponentFixture<InventoryPurchacesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryPurchacesReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryPurchacesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
