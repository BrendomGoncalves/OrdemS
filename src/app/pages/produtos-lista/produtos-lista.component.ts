import {Component, OnInit, signal} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  FormsModule, ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Produto} from '../../models/produto';
import {ProdutosService} from '../../services/produto/produtos.service';
import {delay, map, Observable, of} from 'rxjs';
import {Button, ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {CurrencyPipe, NgIf, PercentPipe} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {MessageModule} from 'primeng/message';
import {generateUniqueId} from '../../ferramentas/utils';
import {ToastModule} from 'primeng/toast';
import {SkeletonModule} from 'primeng/skeleton';

@Component({
  selector: 'app-produtos-lista',
  standalone: true,
  imports: [
    ButtonDirective,
    RouterLink,
    Button,
    CurrencyPipe,
    FormsModule,
    InputTextModule,
    PrimeTemplate,
    TableModule,
    PercentPipe,
    DialogModule,
    NgIf,
    ReactiveFormsModule,
    MessageModule,
    ToastModule,
    SkeletonModule
  ],
  templateUrl: './produtos-lista.component.html',
  styleUrl: './produtos-lista.component.css'
})
export class ProdutosListaComponent implements OnInit {
  Produtos: Produto[] = []; // Lista de produtos
  filtro: string = ''; // Objeto para filtrar produtos por nome
  produtoForm: FormGroup; // Formulário de cadastro de produtos
  editando: { [key: string]: boolean } = {}; // Objeto para controlar a edição de produtos

  // Estatisticas
  QProdutos = signal(this.Produtos.length); // Quantidade de produtos

  // Dialogos
  verDetalhesProduto: boolean = false; // Dialogo para ver mais detalhes de um produto
  verAdicionarProduto: boolean = false; // Dialogo para adicionar um produto

  // Carregamento
  carregandoDados: boolean = true; // Variável para controlar o carregamento de produtos

  constructor(
    private produtoService: ProdutosService,
    private fb: FormBuilder,
    private messageService: MessageService) {
    this.produtoForm = this.fb.group({
      id: [''],
      nome: ['', [Validators.required, Validators.minLength(3)], [this.asyncValidator()]], // Deve ter no mínimo 3 caracteres
      unidadeVenda: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)], [this.asyncValidator()]], // Deve ter no mínimo 3 caracteres
      precoCompra: ['', [Validators.min(0)], [this.asyncValidator()]], // Deve ser maior ou igual a 0
      precoVenda: ['', [Validators.min(0)], [this.asyncValidator()]], // Deve ser maior ou igual a 0
      lucro: ['', [Validators.min(0)], [this.asyncValidator()]], // Deve ser maior ou igual a 0
      estoque: ['', [Validators.min(0)], [this.asyncValidator()]], // Deve ser maior ou igual a 0
      quantidadeVenda: [''], // Não precisa de validação
      observacoes: ['', [Validators.minLength(3)], [this.asyncValidator()]] // Deve ter no mínimo 3 caracteres
    });
    this.resetarEdicao();
  }

  async ngOnInit() {
    await this.carregarProdutos();
  }

  // Utiliza o serviço de produto para carregar a lista de produtos
  async carregarProdutos() {
    (await this.produtoService.getProdutos()).subscribe(produtos => {
      this.Produtos = produtos;
      setTimeout(() => {
        this.carregandoDados = false;
        this.estatisticaProdutos(produtos);
      }, 1500);
    });
  }

  // Atualiza as estatisticas de produto
  estatisticaProdutos(produtos: Produto[]) {
    this.QProdutos.set(produtos.length);
  }

  // Filtra os produtos por nome
  get produtosFiltrados(): Produto[] {
    if (!this.filtro) {
      return this.Produtos;
    }
    return this.Produtos.filter(produto => produto.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Utiliza o serviço de produto para adicionar um novo produto
  salvarProduto() {
    const novoProduto: Produto = this.produtoForm.value;
    if (this.Produtos.find(produto => produto.nome === novoProduto.nome)?.nome === novoProduto.nome) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Produto já cadastrado!'
      });
    } else if (this.produtoForm.valid) {
      novoProduto.id = generateUniqueId();
      this.produtoService.addProduto(novoProduto).subscribe(() => {
        this.carregarProdutos().then();
        this.estatisticaProdutos(this.Produtos);
        this.fecharAdicionarProduto();
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Verifique se todos os campos estão preenchidos corretamente!'
      });
    }
  }

  // Utiliza o serviço de produto para deletar um produto
  deletarProduto() {
    const idDeletar = this.produtoForm.get('id')?.value;
    if (this.Produtos.find(produto => produto.id === idDeletar)?.id === idDeletar) {
      this.produtoService.deleteProduto(idDeletar).subscribe(() => {
        this.carregarProdutos().then();
        this.fecharDetalhesProduto();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto deletado!'
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Produto não encontrado!'
      });
    }
  }

  // Reseta o objeto de edição
  resetarEdicao() {
    Object.keys(this.produtoForm.controls).forEach(key => {
      this.editando[key] = false;
    });
  }

  // Ativa a edição de um campo
  ativarEdicao(campo: string) {
    this.editando[campo] = true;
  }

  // Salva a edição de um campo
  salvarEdicao(campo: string) {
    const produtoEditado = this.produtoForm.value;
    let produtoBanco: Produto = this.Produtos.find(c => c.id === produtoEditado.id)!;
    if (produtoEditado.nome !== produtoBanco.nome) {
      this.produtoService.updateProduto(produtoEditado.id, produtoEditado).subscribe(() => {
        this.editando[campo] = false;
        this.carregarProdutos().then();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto editado!'
        });
      });
    } else {
      this.editando[campo] = false;
    }
  }

  // Abre o modal de adicionar produto
  abrirAdicionarProduto() {
    this.produtoForm.reset();
    this.verAdicionarProduto = true;
  }

  // Fecha o modal de adicionar produto
  fecharAdicionarProduto() {
    this.produtoForm.reset();
    this.verAdicionarProduto = false;
  }

  // Abre o modal de detalhes do produto
  abrirDetalhesProduto(produto: Produto) {
    this.produtoForm.setValue({
      ...produto
    });
    this.verDetalhesProduto = true;
  }

  // Fecha o modal de detalhes do produto
  fecharDetalhesProduto() {
    this.produtoForm.reset();
    this.resetarEdicao();
    this.verDetalhesProduto = false;
  }

  // Função de validação assíncrona
  asyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        delay(1000), // Simulate async operation
        map(value => {
          return value === 'invalid' ? {invalidAsync: true} : null;
        })
      );
    };
  }
}
