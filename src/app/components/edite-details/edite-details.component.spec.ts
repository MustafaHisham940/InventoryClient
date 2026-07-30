import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeDetailsComponent } from './edite-details.component';

describe('EditeDetailsComponent', () => {
  let component: EditeDetailsComponent;
  let fixture: ComponentFixture<EditeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditeDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
