import { TestBed } from '@angular/core/testing';

import { EntradaEquipamentoService } from './entrada-equipamento.service';

describe('EntradaEquipamentoService', () => {
  let service: EntradaEquipamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntradaEquipamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
