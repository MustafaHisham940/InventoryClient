import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrnsPurchacesComponent } from './trns-purchaces.component';

describe('TrnsPurchacesComponent', () => {
  let component: TrnsPurchacesComponent;
  let fixture: ComponentFixture<TrnsPurchacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrnsPurchacesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrnsPurchacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
