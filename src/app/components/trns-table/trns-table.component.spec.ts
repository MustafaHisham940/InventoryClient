import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrnsTableComponent } from './trns-table.component';

describe('TrnsTableComponent', () => {
  let component: TrnsTableComponent;
  let fixture: ComponentFixture<TrnsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrnsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrnsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
