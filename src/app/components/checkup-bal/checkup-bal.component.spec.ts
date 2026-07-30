import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckupBalComponent } from './checkup-bal.component';

describe('CheckupBalComponent', () => {
  let component: CheckupBalComponent;
  let fixture: ComponentFixture<CheckupBalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckupBalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckupBalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
