import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavToItemBalComponent } from './nav-to-item-bal.component';

describe('NavToItemBalComponent', () => {
  let component: NavToItemBalComponent;
  let fixture: ComponentFixture<NavToItemBalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavToItemBalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavToItemBalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
