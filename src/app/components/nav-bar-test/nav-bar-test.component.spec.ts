import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarTestComponent } from './nav-bar-test.component';

describe('NavBarTestComponent', () => {
  let component: NavBarTestComponent;
  let fixture: ComponentFixture<NavBarTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavBarTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
