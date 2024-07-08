import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetPageComponent } from './pet-page.component';

describe('PetPageComponent', () => {
  let component: PetPageComponent;
  let fixture: ComponentFixture<PetPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetPageComponent]
    });
    fixture = TestBed.createComponent(PetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
