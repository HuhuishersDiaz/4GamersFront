import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuentroCampeonatoComponent } from './encuentro-campeonato.component';

describe('EncuentroCampeonatoComponent', () => {
  let component: EncuentroCampeonatoComponent;
  let fixture: ComponentFixture<EncuentroCampeonatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuentroCampeonatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuentroCampeonatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
