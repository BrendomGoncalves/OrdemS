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
    ToastModule
  ],
  templateUrl: './ordem-lista.component.html',
  styleUrl: './ordem-lista.component.css'
})
export class OrdemListaComponent implements OnInit {
  Ordens: OrdemServico[] = [
    {
      id: '1',
      empresa: {
        nome: 'Oryc Info Service',
        cnpj: '14.670.398/0001-88',
        endereco: "Caminho 3, 31, Hernani Sá, Ilhéus - BA",
        "tecnico": "Cyronaldo dos Santos Gonçalves",
        telefone: '(73) 3223-3793',
        celular: '(73) 98825-5273',
        email: 'oryc_service@hotmail.com'
      },
      cliente: {
        id: '1',
        nome: 'João Da Silva Marineles Ferreira de Sá Pinto',
        telefone: '123456789',
        email: 'joao@email.com',
        cpf: '075.123.456-78',
        tipoCliente: 'PF',
        observacoes: 'Informações importantes sobre o cliente',
        cidade: 'São Paulo',
        endereco: 'Rua dos Bobos',
        celular: '(73)987654321',
        ie: 'empty',
        cnpj: 'empty',
        fantasia: 'empty',
        bairro: 'Lavinia',
        numero: '123',
        dataCadastro: new Date()
      },
      equipamento: 'Notebook VivoBook VJ123 e Carregador',
      dataAbertura: new Date('2024/11/20'),
      dataConclusao: new Date('2024-11-30'),
      descricaoProblema: 'Notebook Lento',
      laudoTecnico: 'Formatação',
      status: StatusOrdemServicoEnum.EM_ANDAMENTO,
      valorTotal: 120,
      servicos: [
        {
          id: '1',
          nome: 'Formatação',
          categoria: {id: '1', nome: 'Software', descricao: 'Descrição Categoria'},
          precoVenda: 120,
          dataCadastro: new Date('2024-03-20'),
          observacoes: 'Observações sobre o serviço',
          quantidadeVenda: 1
        }
      ],
      produtosUtilizados: [],
      pagamento: {
        metodoPagamento: MetodoPagamentoEnum.PIX,
        dataPagamento: null,
        statusPagamento: StatusPagamentoEnum.EM_MANUTENCAO,
        observacoes: 'No mesmo dia',
        descontos: []
      },
    },
    {
      id: '2',
      empresa: {
        nome: 'Oryc Info Service',
        cnpj: '14.670.398/0001-88',
        endereco: "Caminho 3, 31, Hernani Sá, Ilhéus - BA",
        tecnico: "Cyronaldo dos Santos Gonçalves",
        telefone: '(73) 3223-3793',
        celular: '(73) 98825-5273',
        email: 'oryc_service@hotmail.com'
      },
      cliente: {
        id: '2',
        nome: 'Maria dos Santos',
        telefone: '123456789',
        email: 'maria@email.com',
        cpf: '077.153.456-78',
        tipoCliente: 'PF',
        observacoes: 'Informações importantes sobre o cliente',
        cidade: 'São Paulo',
        endereco: 'Rua dos Bobos',
        celular: '(73)987654321',
        ie: 'empty',
        cnpj: 'empty',
        fantasia: 'empty',
        bairro: 'Lavinia',
        numero: '123',
        dataCadastro: new Date()
      },
      equipamento: 'CPU',
      dataAbertura: new Date('2024-11-19'),
      dataConclusao: new Date('2024-11-23'),
      descricaoProblema: 'Hd Queimado',
      laudoTecnico: 'Troca de HD',
      status: StatusOrdemServicoEnum.CONCLUIDO,
      valorTotal: 280,
      servicos: [
        {
          id: '1',
          nome: 'Diagnóstico de Hardware',
          categoria: {id: '1', nome: 'Hardware', descricao: 'Descrição Categoria'},
          precoVenda: 40,
          dataCadastro: new Date('2024-03-20'),
          observacoes: 'Observações sobre o serviço',
          quantidadeVenda: 1
        }
      ],
      produtosUtilizados: [
        {
          id: '1',
          nome: 'HD 1TB',
          precoVenda: 240,
          precoCompra: 200,
          lucro: 40,
          observacoes: 'Observações sobre o produto',
          estoque: 5,
          unidadeVenda: 'UN',
          quantidadeVenda: 1
        },
        {
          id: '2',
          nome: 'Cabo SATA',
          precoVenda: 15,
          precoCompra: 8,
          lucro: 7,
          observacoes: 'Observações sobre o produto',
          estoque: 10,
          unidadeVenda: 'UN',
          quantidadeVenda: 1
        }
      ],
      pagamento: {
        metodoPagamento: MetodoPagamentoEnum.CARTAO,
        dataPagamento: new Date('2024-11-23'),
        statusPagamento: StatusPagamentoEnum.PAGO,
        observacoes: 'Parcelado em 2x',
        descontos: [
          {valor: 5, descricao: 'Desconto em conjunto de HD e SATA'}
        ]
      },
    },
    {
      id: '3',
      empresa: {
        nome: 'Oryc Info Service',
        cnpj: '14.670.398/0001-88',
        endereco: "Caminho 3, 31, Hernani Sá, Ilhéus - BA",
        tecnico: "Cyronaldo dos Santos Gonçalves",
        telefone: '(73) 3223-3793',
        celular: '(73) 98825-5273',
        email: 'oryc_service@hotmail.com'
      },
      cliente: {
        id: '3',
        nome: 'José Carlos',
        telefone: '123456789',
        email: 'jose@email.com',
        cpf: '080.153.806-78',
        tipoCliente: 'PF',
        observacoes: 'Informações importantes sobre o cliente',
        cidade: 'São Paulo',
        endereco: 'Rua dos Bobos',
        celular: '(73)987654321',
        ie: 'empty',
        cnpj: 'empty',
        fantasia: 'empty',
        bairro: 'Lavinia',
        numero: '123',
        dataCadastro: new Date()
      },
      equipamento: 'Netbook Positivo Styles e Carregador',
      dataAbertura: new Date('2024-11-20'),
      dataConclusao: new Date('2024-11-22'),
      descricaoProblema: 'Hd Queimado',
      laudoTecnico: 'Troca de HD',
      status: StatusOrdemServicoEnum.CANCELADO,
      valorTotal: 0,
      servicos: [],
      produtosUtilizados: [],
      pagamento: {
        metodoPagamento: MetodoPagamentoEnum.DINHEIRO,
        dataPagamento: null,
        statusPagamento: StatusPagamentoEnum.CANCELADO,
        observacoes: 'No mesmo dia',
        descontos: []
      },
    }
  ];
  filtro: string = '';
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
    pagamento: {metodoPagamento: MetodoPagamentoEnum.EM_MANUTENCAO, statusPagamento: StatusPagamentoEnum.EM_MANUTENCAO, observacoes: '', dataPagamento: null, descontos: []},
  }

  // Estatisticas
  QOrdens = signal(this.Ordens.length);
  valorTotalOrdens: number = 0;
  dadosPie: any;
  opcoesPie: any;
  datasetPie: number[] = [];

  // Dialogos
  verDetalhesOrdem: boolean = false;

  // Carregamento
  carregandoDados: boolean = true;

  constructor(private messageService: MessageService, private ordemService: OrdensService) {
  }

  ngOnInit() {
    this.carregarOrdens();

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
  carregarOrdens() {
    this.ordemService.getOrdens().subscribe(ordens => {
      // TODO: Retirar comentario
      // this.Ordens = ordens;
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

  // salvarOrdem() {
  //   let novaOrdem: OrdemServico = this.ordemForm.value;
  //   if (this.ordemForm.valid) {
  //     novaOrdem.id = generateUniqueId();
  //     this.ordemService.addOrdem(novaOrdem).subscribe(() => {
  //       this.carregarOrdens();
  //       this.estatisticaOrdens(this.Ordens);
  //       this.fecharAdicionarOrdem();
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Ordem de Serviço',
  //         detail: 'Ordem de serviço adicionada'
  //       });
  //     });
  //   } else {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Ordem de Serviço',
  //       detail: 'Verifique se os campos estão preenchidos corretamente'
  //     });
  //   }
  // }

  deletarOrdem() {
    if (this.Ordens.find(ordem => ordem.id === this.ordemSelecionada.id)?.id === this.ordemSelecionada.id) {
      this.ordemService.deleteOrdem(this.ordemSelecionada.id).subscribe(() => {
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
    this.ordemSelecionada = ordem;
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
      pagamento: {metodoPagamento: MetodoPagamentoEnum.EM_MANUTENCAO, statusPagamento: StatusPagamentoEnum.EM_MANUTENCAO, observacoes: '', dataPagamento: null, descontos: []},
    }
    this.verDetalhesOrdem = false;
  }
}
