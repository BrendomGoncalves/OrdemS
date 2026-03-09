import {Component, OnInit, signal} from '@angular/core';
import {
  FormBuilder,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {Categoria} from '../../models/categoria/categoria';
import {CategoriasService} from '../../services/categoria/categorias.service';
import {Button, ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {MessageModule} from 'primeng/message';
import {asyncValidator, hasNullProperties} from '../../ferramentas/utils';
import {ToastModule} from 'primeng/toast';
import {SkeletonModule} from 'primeng/skeleton';
import {ChartModule} from 'primeng/chart';
import {CategoriaCreateDto} from '../../models/categoria/categoriaCreateDto';

@Component({
  selector: 'app-categorias-lista',
  standalone: true,
  imports: [
    ButtonDirective,
    RouterLink,
    Button,
    InputTextModule,
    PaginatorModule,
    PrimeTemplate,
    TableModule,
    DialogModule,
    NgIf,
    ReactiveFormsModule,
    MessageModule,
    ToastModule,
    FormsModule,
    SkeletonModule,
    ChartModule
  ],
  templateUrl: './categorias-lista.component.html',
  styleUrl: './categorias-lista.component.css'
})
export class CategoriasListaComponent implements OnInit {
  Categorias: Categoria[] = []; // Lista de serviços
  filtro: string = ''; // Objeto para filtrar serviços por nome
  categoriaForm: FormGroup; // Formulário de cadastro de serviços
  editando: { [key: string]: boolean } = {}; // Objeto para controlar a edição de serviços

  // Estatisticas
  QCategorias = signal(this.Categorias.length); // Quantidade de serviços

  // Dialogos
  verDetalhesCategoria: boolean = false; // Dialogo para ver detalhes de um serviço
  verAdicionarCategoria: boolean = false; // Dialogo para adicionar um

  // Carregamento
  carregandoDados: boolean = true; // Controla o carregamento de dados

  constructor(private categoriaService: CategoriasService,
              private fb: FormBuilder,
              private messageService: MessageService) {
    this.categoriaForm = this.fb.group({
      id: [0], // ID do serviço,
      createdAt: [new Date()], // Data de criação do serviço
      updatedAt: [new Date()], // Data de atualização do serviço
      nome: ['', [Validators.required, Validators.minLength(3)], [asyncValidator()]], // Deve ter no mínimo 3 caracteres
      descricao: ['', [Validators.minLength(3)], [asyncValidator()]] // Deve ter no mínimo 3 caracteres
    });
    this.resetarEdicao();
  }

  async ngOnInit() {
    await this.carregarCategorias().then();
  }

  // Utiliza o serviço de categoria para carregar a lista de categorias
  async carregarCategorias() {
    (await this.categoriaService.getCategorias()).subscribe({
      next: (categorias) => {
        this.Categorias = categorias;
        setTimeout(() => {
          this.carregandoDados = false;
          this.estatisticaCategoria(categorias);
        }, 1000);
      },
      error: (err) => {
        this.carregandoDados = false;
        this.messageService.add({
          severity: 'info',
          summary: 'Categorias',
          detail: `${err.error.message}`
        });
      }
    });
  }

  // Utiliza o serviço de cliente para adicionar um novo cliente
  async salvarCategoria() {
    const novaCategoria: CategoriaCreateDto = {
      nome: this.categoriaForm.get('nome')?.value,
      descricao: this.categoriaForm.get('descricao')?.value,
    };

    if (!hasNullProperties(novaCategoria)) {
      (await this.categoriaService.addCategoria(novaCategoria)).subscribe({
        next: (categoria) => {
          this.carregarCategorias().then();
          this.estatisticaCategoria(this.Categorias);
          this.fecharAdicionarCategoria();
          this.messageService.add({
            severity: 'success',
            summary: 'Categoria',
            detail: `${categoria.nome} adicionada.`
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Categoria',
            detail: `${err.error.message}`
          });
        }
      })
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Categoria Inválida',
        detail: 'Verifique se os campos estão preenchidos corretamente.'
      });
    }
  }

  // Utiliza o serviço de cliente para deletar um cliente
  async deletarCategoria() {
    const idDeleteCategoria = this.categoriaForm.get('id')?.value;

    if (idDeleteCategoria) {
      (await this.categoriaService.deleteCategoria(idDeleteCategoria)).subscribe({
        next: () => {
          this.carregarCategorias().then();
          this.fecharDetalhesCategoria();
          this.messageService.add({
            severity: 'success',
            summary: 'Categoria',
            detail: `Categoria deletada`
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Categoria',
            detail: `${err.error.message}`
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Categoria Inválida',
        detail: 'Verifique se os campos estão preenchidos corretamente'
      });
    }
  }

  // Salva a edição de um campo
  async editarCategoria(campo: string) {
    const categoriaEditada = this.categoriaForm.value;

    if (!hasNullProperties(categoriaEditada)) {
      (await this.categoriaService.updateCategoria(categoriaEditada.id, categoriaEditada)).subscribe({
        next: () => {
          this.editando[campo] = false;
          this.carregarCategorias().then();
          this.messageService.add({
            severity: 'success',
            summary: 'Categoria',
            detail: 'Categoria editada'
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Categoria',
            detail: `${err.error.message}`
          });
        }
      });
    } else {
      this.editando[campo] = false;
      this.messageService.add({
        severity: 'info',
        summary: 'Categoria Inválida',
        detail: 'Verifique se os campos estão preenchidos corretamente'
      });
    }
  }

  // Atualiza as estatisticas de cliente
  estatisticaCategoria(categorias: Categoria[]) {
    this.QCategorias.set(categorias.length);
  }

  // Reseta o objeto de edição
  resetarEdicao() {
    Object.keys(this.categoriaForm.controls).forEach(key => {
      this.editando[key] = false;
    });
  }

  // Ativa a edição de um campo
  ativarEdicao(campo: string) {
    this.editando[campo] = true;
  }

  // Abre o modal de adicionar cliente
  abrirAdicionarCategoria() {
    this.categoriaForm.reset();
    this.verAdicionarCategoria = true;
  }

  // Fecha o modal de adicionar cliente
  fecharAdicionarCategoria() {
    this.categoriaForm.reset();
    this.verAdicionarCategoria = false;
  }

  // Abre o modal de detalhes do cliente
  abrirDetalhesCategoria(categoria: Categoria) {
    this.categoriaForm.setValue({
      ...categoria
    });
    this.verDetalhesCategoria = true;
  }

  // Fecha o modal de detalhes do cliente
  fecharDetalhesCategoria() {
    this.categoriaForm.reset();
    this.resetarEdicao();
    this.verDetalhesCategoria = false;
  }

  // Filtra os clientes por nome
  get categoriasFiltrados(): Categoria[] {
    if (!this.filtro) {
      return this.Categorias;
    }
    return this.Categorias.filter(categoria =>
      categoria.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
}
