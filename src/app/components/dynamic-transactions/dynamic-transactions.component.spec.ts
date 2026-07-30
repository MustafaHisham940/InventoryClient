import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTransactionsComponent } from './dynamic-transactions.component';

describe('DynamicTransactionsComponent', () => {
  let component: DynamicTransactionsComponent;
  let fixture: ComponentFixture<DynamicTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
