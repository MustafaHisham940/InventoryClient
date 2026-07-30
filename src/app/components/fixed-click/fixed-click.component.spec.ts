import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedClickComponent } from './fixed-click.component';

describe('FixedClickComponent', () => {
  let component: FixedClickComponent;
  let fixture: ComponentFixture<FixedClickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedClickComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FixedClickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
