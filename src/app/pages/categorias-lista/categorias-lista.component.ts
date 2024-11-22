import {Component, OnInit, signal} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Categoria} from '../../models/categoria';
import {CategoriasService} from '../../services/categoria/categorias.service';
import {delay, map, Observable, of} from 'rxjs';
import {Button, ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {CurrencyPipe, NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';
import {PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {MessageModule} from 'primeng/message';
import {generateUniqueId} from '../../ferramentas/utils';

@Component({
  selector: 'app-categorias-lista',
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
    DialogModule,
    NgIf,
    ReactiveFormsModule,
    MessageModule
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

  constructor(private categoriaService: CategoriasService, private fb: FormBuilder) {
    this.categoriaForm = this.fb.group({
      id: [''],
      nome: ['', [Validators.minLength(3)], [this.asyncValidator()]], // Deve ter no mínimo 3 caracteres
      descricao: ['', [Validators.minLength(3)], [this.asyncValidator()]] // Deve ter no mínimo 3 caracteres
    });
    this.resetarEdicao();
  }

  ngOnInit() {
    this.carregarCategorias();
  }

  // Utiliza o serviço de categoria para carregar a lista de categorias
  carregarCategorias() {
    this.categoriaService.getCategorias().subscribe(categorias => {
      this.estatisticaCategoria(categorias);
      this.Categorias = categorias;
    });
  }

  // Atualiza as estatisticas de cliente
  estatisticaCategoria(categorias: Categoria[]) {
    this.QCategorias.set(categorias.length);
  }

  // Filtra os cliente por nome
  get categoriasFiltrados(): Categoria[] {
    if (!this.filtro) {
      return this.Categorias;
    }
    return this.Categorias.filter(categoria =>
      categoria.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Utiliza o serviço de cliente para adicionar um novo cliente
  salvarCategoria() {
    const novaCategoria: Categoria = this.categoriaForm.value;
    novaCategoria.id = generateUniqueId();
    // TODO: Fazer isso pra todos os outro (serviços e clientes)
    let categoriaBanco: Categoria = this.Categorias.find(c => c.id === novaCategoria.id)!;
    if (categoriaBanco == undefined) {
      this.categoriaService.addCategoria(novaCategoria).subscribe(() => {
        this.carregarCategorias();
        this.estatisticaCategoria(this.Categorias);
        this.fecharAdicionarCategoria();
      });
    }
  }

  // Utiliza o serviço de cliente para deletar um cliente
  deletarCategoria() {
    const idDeletar = this.categoriaForm.get('id')?.value;
    this.categoriaService.deleteCategoria(idDeletar).subscribe(() => {
      this.carregarCategorias();
      this.fecharDetalhesCategoria();
    });
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

  // Salva a edição de um campo
  salvarEdicao(campo: string) {
    const categoriaEditado = this.categoriaForm.value;
    let categoriaBanco: Categoria = this.Categorias.find(c => c.id === categoriaEditado.id)!;
    if (categoriaEditado.nome !== categoriaBanco.nome) {
      this.categoriaService.updateCategoria(categoriaEditado.id, categoriaEditado).subscribe(() => {
        this.editando[campo] = false;
        this.carregarCategorias();
      });
    } else {
      this.editando[campo] = false;
    }
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

  // Função de validação assíncrona
  asyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        delay(1000), // Simulate async operation
        map(value => {
          return value === 'invalid' ? { invalidAsync: true } : null;
        })
      );
    };
  }
}
