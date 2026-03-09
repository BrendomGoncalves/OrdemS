import { Component, OnInit, signal } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Servico } from '../../models/servico/servico';
import {
  FormBuilder,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ServicosService } from '../../services/servico/servicos.service';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CurrencyPipe, NgIf } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { TabViewModule } from 'primeng/tabview';
import { asyncValidator } from '../../ferramentas/utils';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { Categoria } from '../../models/categoria/categoria';
import { CategoriasService } from '../../services/categoria/categorias.service';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { ServicoCreateDto } from '../../models/servico/servicoCreateDto';
import { OrdensService } from '../../services/ordem/ordens.service';

@Component({
  selector: 'app-servico-lista',
  standalone: true,
  imports: [
    ButtonDirective,
    RouterLink,
    Button,
    InputTextModule,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    CurrencyPipe,
    DialogModule,
    NgIf,
    MessageModule,
    TabViewModule,
    ToastModule,
    SkeletonModule,
    DropdownModule,
    ChartModule
  ],
  templateUrl: './servicos-lista.component.html',
  styleUrl: './servicos-lista.component.css'
})
export class ServicosListaComponent implements OnInit {
  Servicos: Servico[] = []; // Lista de serviços
  filtro: string = ''; // Objeto para filtrar serviços por nome
  servicoForm: FormGroup; // Formulário de cadastro de serviços
  editando: { [key: string]: boolean } = {}; // Objeto para controlar a edição de serviços
  listaCategorias: Categoria[] = []; // Lista de categorias

  // Estatisticas
  QServicos = signal(this.Servicos.length); // Quantidade de serviços

  // Dialogos
  verDetalhesServico: boolean = false; // Dialogo para ver detalhes de um serviço
  verAdicionarServico: boolean = false; // Dialogo para adicionar um

  // Carregamento
  carregandoDados: boolean = true; // Indica se os dados estão sendo carregados

  constructor(private servicoService: ServicosService,
    private fb: FormBuilder,
    private categoriasService: CategoriasService,
    private messageService: MessageService,
    private ordensService: OrdensService) {
    this.servicoForm = this.fb.group({
      id: [''], // ID do serviço
      createdAt: [''], // Data de criação
      updatedAt: [''], // Data de atualização
      nome: ['', [Validators.minLength(3)], [asyncValidator()]], // Deve ter no mínimo 3 caracteres
      categoria: [''],
      precoVenda: ['', [Validators.min(0)], [asyncValidator()]], // Deve ser maior ou igual a 0
      observacoes: ['', [Validators.minLength(3)], [asyncValidator()]], // Deve ter no mínimo 3 caracteres
      quantidadeVenda: ['']
    });
    this.resetarEdicao();
  }

  async ngOnInit() {
    await this.carregarServicos();
    (await this.categoriasService.getCategorias()).subscribe((categorias) => {
      this.listaCategorias = categorias
    });
  }

  async carregarServicos() {
    (await this.servicoService.getServicos()).subscribe({
      next: (servicos) => {
        this.Servicos = servicos;
        setTimeout(() => {
          this.carregandoDados = false;
          this.estatisticaServicos(servicos);
        }, 1000);
      },
      error: (err) => {
        this.carregandoDados = false;
        this.messageService.add({
          severity: 'info',
          summary: 'Serviços',
          detail: `${err.error.message}`
        });
      }
    });
  }

  async salvarServico() {
    let novoServico: ServicoCreateDto = {
      nome: this.servicoForm.get('nome')?.value,
      idCategoria: this.servicoForm.get('categoria')?.value,
      precoVenda: this.servicoForm.get('precoVenda')?.value,
      observacoes: this.servicoForm.get('observacoes')?.value,
      quantidadeVenda: this.servicoForm.get('quantidadeVenda')?.value
    };

    if (this.servicoForm.valid) {
      (await this.servicoService.addServico(novoServico)).subscribe({
        next: (servico) => {
          this.carregarServicos().then();
          this.fecharAdicionarServico();
          this.messageService.add({
            severity: 'success',
            summary: 'Serviço',
            detail: 'Serviço adicionado'
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Serviço',
            detail: `${err.error.message}`
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Serviço',
        detail: 'Verifique se os campos estão preenchidos corretamente'
      });
    }
  }

  async deletarServico() {
    const idDeletarServico = this.servicoForm.get('id')?.value;

    if (this.Servicos.find(servico => servico.id === idDeletarServico)?.id === idDeletarServico) {
      (await this.servicoService.deleteServico(idDeletarServico)).subscribe(() => {
        this.carregarServicos().then();
        this.fecharDetalhesServico();
        this.messageService.add({
          severity: 'success',
          summary: 'Serviço',
          detail: 'Serviço deletado'
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Serviço inválido',
        detail: 'Verfique se os campos estão preenchidos corretamente'
      });
    }
  }

  async editarServico(campo: string) {
    const servicoEditado = this.servicoForm.value;

    if (this.servicoForm.valid) {
      (await this.servicoService.updateServico(servicoEditado.id, servicoEditado)).subscribe({
        next: () => {
          this.editando[campo] = false;
          this.carregarServicos().then();
          this.messageService.add({
            severity: 'success',
            summary: 'Serviço',
            detail: 'Serviço atualizado'
          });
        },
        error: (err) => {
          this.editando[campo] = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Serviço',
            detail: `${err.error.message}`
          });
        }
      });
    } else {
      this.editando[campo] = false;
      this.messageService.add({
        severity: 'info',
        summary: 'Serviço inválido',
        detail: 'Verifique se os campos estão preenchidos corretamente'
      })
    }
  }

  estatisticaServicos(servicos: Servico[]) {
    this.QServicos.set(servicos.length);
  }

  get servicosFiltrados(): Servico[] {
    if (!this.filtro) {
      return this.Servicos;
    }
    return this.Servicos.filter(servico =>
      servico.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  resetarEdicao() {
    Object.keys(this.servicoForm.controls).forEach(key => {
      this.editando[key] = false;
    });
  }

  ativarEdicao(campo: string) {
    this.editando[campo] = true;
  }

  abrirAdicionarServico() {
    this.servicoForm.reset();
    this.verAdicionarServico = true;
  }

  fecharAdicionarServico() {
    this.servicoForm.reset();
    this.verAdicionarServico = false;
  }

  abrirDetalhesServico(servico: Servico) {
    this.servicoForm.patchValue({
      id: servico.id || '',
      createdAt: servico.createdAt || '',
      updatedAt: servico.updatedAt || '',
      nome: servico.nome || '',
      categoria: servico.categoria?.nome || '',
      precoVenda: servico.precoVenda || 0,
      observacoes: servico.observacoes || '',
      quantidadeVenda: servico.quantidadeVenda || 0
    });
    this.verDetalhesServico = true;
  }

  fecharDetalhesServico() {
    this.servicoForm.reset();
    this.resetarEdicao();
    this.verDetalhesServico = false;
  }
}
