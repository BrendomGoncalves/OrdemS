import {Component, LOCALE_ID, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClientesService} from '../../services/clientes/clientes.service';
import {DatePipe, NgIf, registerLocaleData, TitleCasePipe} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {ServicosService} from '../../services/servicos/servicos.service';

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    TitleCasePipe,
    NgIf
  ],
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
})
export class PaginaInicialComponent implements OnInit {
  dataAtual: Date = new Date();
  quantidadeClientes: number = 0;
  quantidadeClientesMes: number = 0;
  quantidadeServicos: number = 0;
  ultimoServico: string = 'Nenhum serviço cadastrado';

  constructor(private clienteService: ClientesService, private servicoService: ServicosService) {}

  ngOnInit() {
    this.atualizarEstatisticasClientes();
    this.atualizarEstatisticasServicos();
  }

  atualizarEstatisticasServicos(){
    // Quantidade de serviços cadastrados
    this.servicoService.getQuantidadeServicos().subscribe((quantidade) => {
      this.quantidadeServicos = quantidade;
    });
    this.servicoService.servicoListUpdate$.subscribe(() => {
      this.servicoService.getQuantidadeServicos().subscribe((quantidade) => {
        this.quantidadeServicos = quantidade;
      });
    });

    // Último serviço cadastrado
    this.servicoService.getUltimoServico().subscribe((servico) => {
      if(servico){
        this.ultimoServico = servico;
      }
    });
    this.servicoService.servicoListUpdate$.subscribe(() => {
      this.servicoService.getUltimoServico().subscribe((servico) => {
        if(servico){
          this.ultimoServico = servico;
        }
      });
    });
  }

  atualizarEstatisticasClientes(){
    // Quantidade de clientes cadastrados no mês
    this.clienteService.getQuantidadeClientesMes().subscribe((quantidade) => {
      this.quantidadeClientesMes = quantidade;
    });
    this.clienteService.clientListUpdated$.subscribe(() => {
      this.clienteService.getQuantidadeClientesMes().subscribe((quantidade) => {
        this.quantidadeClientesMes = quantidade;
      });
    });

    // Quantidade de clientes cadastrados
    this.clienteService.getQuantidadeClientes().subscribe((quantidade) => {
      this.quantidadeClientes = quantidade;
    });
    this.clienteService.clientListUpdated$.subscribe(() => {
      this.clienteService.getQuantidadeClientes().subscribe((quantidade) => {
        this.quantidadeClientes = quantidade;
      });
    });
  }
}
