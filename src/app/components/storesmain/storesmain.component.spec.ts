import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresmainComponent } from './storesmain.component';

describe('StoresmainComponent', () => {
  let component: StoresmainComponent;
  let fixture: ComponentFixture<StoresmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoresmainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoresmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
