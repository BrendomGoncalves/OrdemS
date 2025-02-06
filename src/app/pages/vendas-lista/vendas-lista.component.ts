import {Component, OnInit, signal} from '@angular/core';
import {Venda} from '../../models/venda';
import {VendasService} from '../../services/venda/vendas.service';
import {Button, ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import {SkeletonModule} from 'primeng/skeleton';

@Component({
  selector: 'app-vendas-lista',
  standalone: true,
  imports: [
    ButtonDirective,
    RouterLink,
    Button,
    CurrencyPipe,
    InputTextModule,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    DatePipe,
    DialogModule,
    NgForOf,
    ToastModule,
    NgIf,
    SkeletonModule
  ],
  templateUrl: './vendas-lista.component.html',
  styleUrl: './vendas-lista.component.css'
})
export class VendasListaComponent implements OnInit {
  Vendas: Venda[] = []; // Lista de vendas
  vendaSelecionada: Venda = {
    id: '',
    produtos: [],
    nomeCliente: '',
    documentoCliente: '',
    data: null,
    total: 0
  }; // Venda selecionada
  filtro: string = ''; // Objeto para filtrar vendas por nome

  // Estatisticas
  QVendas = signal(this.Vendas.length); // Quantidade de vendas

  // Dialogos
  verDetalhesVenda: boolean = false; // Dialogo para ver mais detalhes de uma venda

  // Carregamento
  carregandoDados: boolean = true; // Variavel para mostrar se os dados estão sendo carregados

  constructor(
    private vendaService: VendasService,
    private messageService: MessageService) {}

  ngOnInit(): void {
    this.carregarVendas();
  }

  carregarVendas(){
    this.vendaService.getVendas().subscribe(vendas => {
      this.Vendas = vendas;
      setTimeout(() => {
        this.carregandoDados = false;
        this.estatisticaVendas(vendas);
      }, 1000);
    });
  }

  estatisticaVendas(vendas: Venda[]){
    this.QVendas.set(vendas.length);
  }

  get vendasFiltradas(): Venda[]{
    if(!this.filtro){
      return this.Vendas;
    }
    return this.Vendas.filter(venda => venda.nomeCliente.toLowerCase().includes(this.filtro.toLowerCase()));
  }

  deletarVenda(id: string){
    if(this.Vendas.find(venda => venda.id === id)?.id === id) {
      this.vendaService.deleteVenda(id).subscribe(() => {
        this.carregarVendas();
        this.fecharDetalhesVenda();
        this.messageService.add({
          severity: 'success',
          summary: 'Venda',
          detail: 'Venda deletada'
        })
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Venda',
        detail: 'Venda não encontrada'
      })
    }
  }

  abrirDetalhesVenda(venda: Venda){
    this.vendaSelecionada = venda
    this.verDetalhesVenda = true;
  }

  fecharDetalhesVenda(){
    this.vendaSelecionada = {
      id: '',
      produtos: [],
      nomeCliente: '',
      documentoCliente: '',
      data: new Date(),
      total: 0
    };
    this.verDetalhesVenda = false;
  }
}
