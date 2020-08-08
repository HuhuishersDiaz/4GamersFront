import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarretiroComponent } from './validarretiro.component';

describe('ValidarretiroComponent', () => {
  let component: ValidarretiroComponent;
  let fixture: ComponentFixture<ValidarretiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidarretiroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidarretiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
