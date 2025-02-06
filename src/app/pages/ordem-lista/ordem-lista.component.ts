import {Component, OnInit, signal} from '@angular/core';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {OrdemServico} from '../../models/ordem-servico';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OrdensService} from '../../services/ordem/ordens.service';
import {Button, ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {StatusOrdemServicoEnum} from '../../enums/statusOrdemServicoEnum';
import {MetodoPagamentoEnum} from '../../enums/metodoPagamentoEnum';
import {StatusPagamentoEnum} from '../../enums/statusPagamentoEnum';
import {DialogModule} from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import {PanelModule} from 'primeng/panel';
import {ChartModule} from 'primeng/chart';
import {Chart, registerables} from 'chart.js';
import {SkeletonModule} from 'primeng/skeleton';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {Desconto} from '../../models/desconto';

Chart.register(...registerables);

@Component({
  selector: 'app-ordem-lista',
  standalone: true,
  imports: [
    ButtonDirective,
    RouterLink,
    Button,
    CurrencyPipe,
    InputTextModule,
    PaginatorModule,
    PrimeTemplate,
    TableModule,
    DatePipe,
    DialogModule,
    ReactiveFormsModule,
    AccordionModule,
    NgIf,
    NgForOf,
    PanelModule,
    ChartModule,
    FormsModule,
    SkeletonModule,
    ToastModule,
    CalendarModule,
    InputTextareaModule
  ],
  templateUrl: './ordem-lista.component.html',
  styleUrl: './ordem-lista.component.css'
})
export class OrdemListaComponent implements OnInit {
  Ordens: OrdemServico[] = [];
  ordemSelecionada: OrdemServico = {
    id: '',
    empresa: {nome: '', cnpj: '', endereco: '', tecnico: '', telefone: '', celular: '', email: ''},
    cliente: null,
    equipamento: '',
    dataAbertura: null,
    dataConclusao: null,
    descricaoProblema: '',
    laudoTecnico: '',
    status: StatusOrdemServicoEnum.EM_ANDAMENTO,
    valorTotal: 0,
    servicos: [],
    produtosUtilizados: [],
    pagamento: {
      metodoPagamento: MetodoPagamentoEnum.DINHEIRO,
      statusPagamento: null,
      observacoes: '',
      dataPagamento: null,
      descontos: [],
      descontoTotal: 0
    },
  }
  filtro: string = '';
  metodoPagamentoItems = [
    {value: MetodoPagamentoEnum.DINHEIRO, icon: 'pi pi-money-bill', color: 'green'},
    {value: MetodoPagamentoEnum.CARTAO_CREDITO, icon: 'pi pi-credit-card', color: 'blue'},
    {value: MetodoPagamentoEnum.CARTAO_DEBITO, icon: 'pi pi-credit-card', color: 'blue'},
    {value: MetodoPagamentoEnum.PIX, icon: 'pi pi-dollar', color: 'gray'}
  ];
  statusPagamentoItems = [
    {value: StatusPagamentoEnum.PAGO, icon: 'pi pi-check-circle', color: 'green'},
    // {value: StatusPagamentoEnum.EM_ABERTO, icon: 'pi pi-clock', color: 'orange'},
    {value: StatusPagamentoEnum.CANCELADO, icon: 'pi pi-times-circle', color: 'red'}
  ];
  descontoAdicionado: Desconto = {valor: 0, descricao: ''};

  // Estatisticas
  QOrdens = signal(this.Ordens.length);
  // valorTotalOrdens: number = 0;
  // dadosPie: any;
  // opcoesPie: any;
  // datasetPie: number[] = [];

  // Dialogos
  verDetalhesOrdem: boolean = false;
  verPagamento: boolean = false;

  // Carregamento
  carregandoDados: boolean = true;
  carregandoBotao: boolean = false;

  protected readonly Object = Object;
  protected readonly MetodoPagamentoEnum = MetodoPagamentoEnum;
  protected readonly StatusPagamentoEnum = StatusPagamentoEnum;
  protected readonly StatusOrdemServicoEnum = StatusOrdemServicoEnum;

  constructor(private messageService: MessageService, private ordemService: OrdensService) {
  }

  ngOnInit() {
    this.carregarOrdens().then();
    // TODO: Corrigir uso dos gráficos
    // const documentStyle = getComputedStyle(document.documentElement);
    // const textColor = documentStyle.getPropertyValue('--text-color');
    // this.datasetPie = [
    //   this.Ordens.filter(ordem => ordem.status === StatusOrdemServicoEnum.PENDENTE).length,
    //   this.Ordens.filter(ordem => ordem.status === StatusOrdemServicoEnum.CONCLUIDO).length,
    //   this.Ordens.filter(ordem => ordem.status === StatusOrdemServicoEnum.CANCELADO).length
    // ]
    // this.dadosPie = {
    //   labels: [StatusOrdemServicoEnum.PENDENTE, StatusOrdemServicoEnum.CONCLUIDO, StatusOrdemServicoEnum.CANCELADO],
    //   datasets: [
    //     {
    //       data: this.datasetPie,
    //       backgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--red-400')],
    //       hoverBackgroundColor: [documentStyle.getPropertyValue('--orange-200'), documentStyle.getPropertyValue('--green-200'), documentStyle.getPropertyValue('--red-200')]
    //     }
    //   ]
    // };
    // this.opcoesPie = {
    //   plugins: {
    //     legend: {
    //       labels: {
    //         usePointStyle: true,
    //         color: textColor
    //       }
    //     }
    //   }
    // };
    // this.valorTotalOrdens = this.Ordens.reduce((acc, ordem) => acc + ordem.valorTotal, 0);
  }

  // Função para carregar as ordens de serviço
  async carregarOrdens() {
    (await this.ordemService.getOrdens()).subscribe(ordens => {
      this.Ordens = ordens;
      setTimeout(() => {
        this.carregandoDados = false;
        this.estatisticaOrdens(ordens);
      }, 1500);
    });
  }

  estatisticaOrdens(ordens: OrdemServico[]) {
    this.QOrdens = signal(ordens.length);
  }

  get ordensFiltradas(): OrdemServico[] {
    if (!this.filtro) {
      return this.Ordens;
    }
    return this.Ordens.filter(ordem => ordem.cliente?.nome.toLowerCase().includes(this.filtro.toLowerCase()));
  }

  async deletarOrdem(idDelete: string) {
    if (this.Ordens.find(ordem => ordem.id === idDelete)?.id === idDelete) {
      (await this.ordemService.deleteOrdem(idDelete)).subscribe(() => {
        this.carregarOrdens();
        this.estatisticaOrdens(this.Ordens);
        this.fecharDetalhesOrdem();
        this.messageService.add({
          severity: 'success',
          summary: 'Ordem de Serviço',
          detail: 'Ordem de serviço deletada'
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Ordem de Serviço',
        detail: 'Essa ordem de serviço não existe'
      });
    }
  }

  abrirDetalhesOrdem(ordem: OrdemServico) {
    this.ordemSelecionada = {
      ...ordem,
      pagamento: {
        ...ordem.pagamento,
        dataPagamento: ordem.pagamento.dataPagamento ? new Date(ordem.pagamento.dataPagamento) : null
      }
    }
    this.verDetalhesOrdem = true;
  }

  fecharDetalhesOrdem() {
    this.ordemSelecionada = {
      id: '',
      empresa: {nome: '', cnpj: '', endereco: '', telefone: '', tecnico: '', celular: '', email: ''},
      cliente: null,
      equipamento: '',
      dataAbertura: null,
      dataConclusao: null,
      descricaoProblema: '',
      laudoTecnico: '',
      status: StatusOrdemServicoEnum.EM_ANDAMENTO,
      valorTotal: 0,
      servicos: [],
      produtosUtilizados: [],
      pagamento: {
        metodoPagamento: MetodoPagamentoEnum.DINHEIRO,
        statusPagamento: null,
        observacoes: '',
        dataPagamento: null,
        descontos: [],
        descontoTotal: 0
      },
    }
    this.verDetalhesOrdem = false;
  }

  abrirVerPagamento() {
    this.verPagamento = true;
  }

  fecharVerPagamento() {
    this.verPagamento = false;
  }

  async salvarPagamento() {
    this.carregandoBotao = true;
    (await this.ordemService.updateOrdem(this.ordemSelecionada.id, this.ordemSelecionada)).subscribe(() => {
      this.carregarOrdens();
      this.estatisticaOrdens(this.Ordens);
    });
    setTimeout(() => {
      this.carregandoBotao = false;
      this.fecharVerPagamento();
    }, 2000);
    this.messageService.add({
      severity: 'success',
      summary: 'Ordem de Serviço',
      detail: 'Pagamento salvo'
    });
  }

  adicionarDesconto() {
    if (this.descontoAdicionado.descricao === '') {
      this.descontoAdicionado.descricao = 'Desconto da loja';
    }
    this.ordemSelecionada.pagamento.descontos.push(this.descontoAdicionado);
    this.ordemSelecionada.pagamento.descontoTotal += this.descontoAdicionado.valor;
    this.ordemSelecionada.pagamento.descontos.sort((a, b) => a.valor - b.valor).reverse();
    this.descontoAdicionado = {valor: 0, descricao: ''};

    this.ordemSelecionada.valorTotal -= this.descontoAdicionado.valor;
  }

  deletarDesconto(desconto: Desconto) {
    this.ordemSelecionada.pagamento.descontos = this.ordemSelecionada.pagamento.descontos.filter(d => d !== desconto);
    this.ordemSelecionada.pagamento.descontoTotal -= desconto.valor;
    this.ordemSelecionada.valorTotal += desconto.valor;
  }

  async statusOrdemServicoAtualizar(ordem: OrdemServico) {
    (await this.ordemService.updateOrdem(ordem.id, ordem)).subscribe(() => {
      this.carregarOrdens();
      this.estatisticaOrdens(this.Ordens);
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Ordem de Serviço',
      detail: 'Status atualizado: ' + ordem.status
    });
  }
}
