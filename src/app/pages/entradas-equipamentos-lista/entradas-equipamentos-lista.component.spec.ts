import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradasEquipamentosListaComponent } from './entradas-equipamentos-lista.component';

describe('EntradasEquipamentosListaComponent', () => {
  let component: EntradasEquipamentosListaComponent;
  let fixture: ComponentFixture<EntradasEquipamentosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradasEquipamentosListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradasEquipamentosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
