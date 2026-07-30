import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItmBalComponent } from './new-itm-bal.component';

describe('NewItmBalComponent', () => {
  let component: NewItmBalComponent;
  let fixture: ComponentFixture<NewItmBalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewItmBalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewItmBalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
