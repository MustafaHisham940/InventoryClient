import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeItemBalComponent } from './edite-item-bal.component';

describe('EditeItemBalComponent', () => {
  let component: EditeItemBalComponent;
  let fixture: ComponentFixture<EditeItemBalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditeItemBalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditeItemBalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
