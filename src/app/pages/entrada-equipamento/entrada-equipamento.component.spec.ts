import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaEquipamentoComponent } from './entrada-equipamento.component';

describe('EntradaEquipamentoComponent', () => {
  let component: EntradaEquipamentoComponent;
  let fixture: ComponentFixture<EntradaEquipamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaEquipamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradaEquipamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
