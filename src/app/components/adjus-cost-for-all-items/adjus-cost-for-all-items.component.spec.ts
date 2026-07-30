import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjusCostForAllItemsComponent } from './adjus-cost-for-all-items.component';

describe('AdjusCostForAllItemsComponent', () => {
  let component: AdjusCostForAllItemsComponent;
  let fixture: ComponentFixture<AdjusCostForAllItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjusCostForAllItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdjusCostForAllItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
