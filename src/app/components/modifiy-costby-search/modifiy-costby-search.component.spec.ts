import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiyCostbySearchComponent } from './modifiy-costby-search.component';

describe('ModifiyCostbySearchComponent', () => {
  let component: ModifiyCostbySearchComponent;
  let fixture: ComponentFixture<ModifiyCostbySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifiyCostbySearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifiyCostbySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
