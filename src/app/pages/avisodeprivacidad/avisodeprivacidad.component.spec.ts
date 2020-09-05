import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisodeprivacidadComponent } from './avisodeprivacidad.component';

describe('AvisodeprivacidadComponent', () => {
  let component: AvisodeprivacidadComponent;
  let fixture: ComponentFixture<AvisodeprivacidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvisodeprivacidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisodeprivacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
