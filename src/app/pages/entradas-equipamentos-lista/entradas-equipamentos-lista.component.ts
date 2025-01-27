import {Component, OnInit, signal} from '@angular/core';
import {EntradaEquipamento} from '../../models/entrada-equipamento';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {EntradaEquipamentoService} from '../../services/entrada-equipamento/entrada-equipamento.service';
import {Button, ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SkeletonModule} from 'primeng/skeleton';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {PanelModule} from 'primeng/panel';

@Component({
  selector: 'app-entradas-equipamentos-lista',
  standalone: true,
  imports: [
    ButtonDirective,
    RouterLink,
    Button,
    DatePipe,
    InputTextModule,
    NgIf,
    PrimeTemplate,
    ReactiveFormsModule,
    SkeletonModule,
    TableModule,
    FormsModule,
    ToastModule,
    DialogModule,
    PanelModule
  ],
  templateUrl: './entradas-equipamentos-lista.component.html',
  styleUrl: './entradas-equipamentos-lista.component.css'
})
export class EntradasEquipamentosListaComponent implements OnInit {
  ListaEntradasEquipamentos: EntradaEquipamento[] = [];
  entradaEquipamentoSelecionada: EntradaEquipamento = {
    id: '',
    empresa: {nome: '', cnpj: '', endereco: '', tecnico: '', telefone: '', celular: '', email: ''},
    cliente: null,
    equipamento: '',
    dataRecebimento: null,
    descricaoProblema: '',
  }
  filtro: string = '';

  // Estatisticas
  QEntradasEquipamentos = signal(this.ListaEntradasEquipamentos.length);

  // Dialogos
  verDetalhesEntradaEquipamento: boolean = false;

  // Carregamento
  carregandoDados: boolean = true;

  constructor(private messageService: MessageService, private entradaEquipamentoService: EntradaEquipamentoService) {
  }

  ngOnInit(): void {
    this.carregarEntradasEquipamentos().then();
    this.carregandoDados = false;
  }

  async carregarEntradasEquipamentos() {
    (await this.entradaEquipamentoService.getEntradasEquipamentos()).subscribe(entradasEquipamentos => {
      this.ListaEntradasEquipamentos = entradasEquipamentos;
      setTimeout(() => {
        this.carregandoDados = false;
        this.estatisticaEntradasEquipamentos(entradasEquipamentos);
      }, 1500);
    })
  }

  estatisticaEntradasEquipamentos(entradasEquipamentos: EntradaEquipamento[]) {
    this.QEntradasEquipamentos = signal(entradasEquipamentos.length);
  }

  get entradasEquipamentosFiltradas() {
    if (!this.filtro) {
      return this.ListaEntradasEquipamentos;
    }
    return this.ListaEntradasEquipamentos.filter(entradaEquipamento => {
      entradaEquipamento.cliente?.nome.toLowerCase().includes(this.filtro.toLowerCase())
    })
  }

  async deletarEntradaEquipamento(idDelete: string) {
    if (this.ListaEntradasEquipamentos.find(entradaEquipamento => entradaEquipamento.id === idDelete)?.id === idDelete) {
      (await this.entradaEquipamentoService.deleteEntradaEquipamento(idDelete)).subscribe(() => {
        this.carregarEntradasEquipamentos();
        this.estatisticaEntradasEquipamentos(this.ListaEntradasEquipamentos);
        this.fecharDetalhesEntradaEquipamento();
        this.messageService.add({
          severity: 'success',
          summary: 'Entrada de Equipamento',
          detail: 'Entrada de equipamento deletada'
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Entrada de Equipamento',
        detail: 'Essa entrada de equipamento não existe'
      })
    }
  }

  abrirDetalhesEntradaEquipamento(entradaEquipamento: EntradaEquipamento) {
    this.entradaEquipamentoSelecionada = entradaEquipamento;
    this.verDetalhesEntradaEquipamento = true;
  }

  fecharDetalhesEntradaEquipamento() {
    this.entradaEquipamentoSelecionada = {
      id: '',
      empresa: {nome: '', cnpj: '', endereco: '', tecnico: '', telefone: '', celular: '', email: ''},
      cliente: null,
      equipamento: '',
      dataRecebimento: null,
      descricaoProblema: '',
    }
    this.verDetalhesEntradaEquipamento = false;
  }
}
