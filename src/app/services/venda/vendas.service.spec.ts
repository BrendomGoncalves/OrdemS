import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VendasService } from './vendas.service';

describe('VendasService', () => {
  let service: VendasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VendasService]
    });
    service = TestBed.inject(VendasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get vendas', () => {
    service.getVendas().subscribe(vendas => {
      expect(vendas).toBeTruthy();
    });
  });
});
