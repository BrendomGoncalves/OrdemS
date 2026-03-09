import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule, ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Produto } from '../../models/produto';
import { ProdutosService } from '../../services/produto/produtos.service';
import { Button, ButtonDirective } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgIf, PercentPipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { asyncValidator } from '../../ferramentas/utils';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    SkeletonModule,
    DropdownModule
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
      nome: ['', [Validators.required, Validators.minLength(3)], [asyncValidator()]], // Deve ter no mínimo 3 caracteres
      precoCompra: ['', [Validators.min(0)], [asyncValidator()]], // Deve ser maior ou igual a 0
      precoVenda: ['', [Validators.min(0)], [asyncValidator()]], // Deve ser maior ou igual a 0
      lucro: ['', [Validators.min(0)], [asyncValidator()]], // Deve ser maior ou igual a 0
      estoque: ['', [Validators.min(0)], [asyncValidator()]], // Deve ser maior ou igual a 0
      quantidadeVenda: [''], // Não precisa de validação
      observacoes: ['', [Validators.minLength(3)], [asyncValidator()]] // Deve ter no mínimo 3 caracteres
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
      }, 1000);
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
  async salvarProduto() {
    let novoProduto: Produto = this.produtoForm.value;

    if (this.Produtos.find(produto => produto.nome === novoProduto.nome)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Produto já cadastrado!'
      });
    } else if (this.produtoForm.valid) {
      novoProduto.id = await this.produtoService.novoId();
      (await this.produtoService.addProduto(novoProduto)).subscribe(() => {
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
  async deletarProduto() {
    const idDeletar = this.produtoForm.get('id')?.value;
    if (this.Produtos.find(produto => produto.id === idDeletar)?.id === idDeletar) {
      (await this.produtoService.deleteProduto(idDeletar)).subscribe(() => {
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
  async salvarEdicao(campo: string) {
    const produtoEditado = this.produtoForm.value;
    let produtoBanco: Produto = this.Produtos.find(c => c.id === produtoEditado.id)!;
    if (produtoEditado.nome !== produtoBanco.nome) {
      (await this.produtoService.updateProduto(produtoEditado.id, produtoEditado)).subscribe(() => {
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

  // Exporta os produtos para PDF
  exportarPDF() {
    if (this.produtosFiltrados.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Exportação',
        detail: 'Não há produtos para exportar!'
      });
      return;
    }

    const doc = new jsPDF('landscape', 'mm', 'a4');

    // Cores do tema (vermelho)
    const corPrimaria = [239, 68, 68]; // #ef4444 (red-500)
    const corSecundaria = [220, 38, 38]; // #dc2626 (red-600)
    const corTexto = [31, 41, 55]; // #1f2937 (gray-800)
    const corTextoClaro = [107, 114, 128]; // #6b7280 (gray-500)

    // Cabeçalho
    doc.setFillColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE PRODUTOS', doc.internal.pageSize.getWidth() / 2, 12, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Gerado em: ${dataAtual}`, doc.internal.pageSize.getWidth() / 2, 18, { align: 'center' });
    doc.text(`Total de produtos: ${this.produtosFiltrados.length}`, doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });

    // Prepara os dados da tabela
    const dadosTabela = this.produtosFiltrados.map(produto => {
      const lucro = produto.precoVenda - produto.precoCompra;
      const lucroPercentual = produto.precoCompra > 0
        ? ((lucro / produto.precoCompra) * 100).toFixed(2) + '%'
        : '0%';
      const totalEstoquePC = produto.estoque * produto.precoCompra;
      const totalEstoquePV = produto.estoque * produto.precoVenda;

      return [
        produto.nome || '-',
        produto.estoque?.toString() || '0',
        this.formatarMoeda(produto.precoCompra || 0),
        this.formatarMoeda(produto.precoVenda || 0),
        this.formatarMoeda(lucro),
        lucroPercentual,
        this.formatarMoeda(totalEstoquePC),
        this.formatarMoeda(totalEstoquePV),
        produto.quantidadeVenda?.toString() || '0',
        produto.observacoes || '-'
      ];
    });

    // Cria a tabela
    autoTable(doc, {
      startY: 30,
      head: [[
        'Nome',
        'Estoque',
        'Preço Compra',
        'Preço Venda',
        'Lucro',
        'Lucro (%)',
        'Total Estoque (PC)',
        'Total Estoque (PV)',
        'Qtd. Vendida',
        'Observações'
      ]],
      body: dadosTabela,
      theme: 'striped',
      headStyles: {
        fillColor: [corSecundaria[0], corSecundaria[1], corSecundaria[2]],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        textColor: [corTexto[0], corTexto[1], corTexto[2]],
        fontSize: 8
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251] // gray-50
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Nome
        1: { cellWidth: 20, halign: 'center' }, // Estoque
        2: { cellWidth: 25, halign: 'right' }, // Preço Compra
        3: { cellWidth: 25, halign: 'right' }, // Preço Venda
        4: { cellWidth: 25, halign: 'right' }, // Lucro
        5: { cellWidth: 20, halign: 'center' }, // Lucro %
        6: { cellWidth: 30, halign: 'right' }, // Total Estoque PC
        7: { cellWidth: 30, halign: 'right' }, // Total Estoque PV
        8: { cellWidth: 20, halign: 'center' }, // Qtd Vendida
        9: { cellWidth: 40 } // Observações
      },
      styles: {
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      margin: { top: 30, left: 10, right: 10 }
    });

    // Calcula totais
    const totalEstoque = this.produtosFiltrados.reduce((sum, p) => sum + (p.estoque || 0), 0);
    const totalValorCompra = this.produtosFiltrados.reduce((sum, p) => sum + ((p.estoque || 0) * (p.precoCompra || 0)), 0);
    const totalValorVenda = this.produtosFiltrados.reduce((sum, p) => sum + ((p.estoque || 0) * (p.precoVenda || 0)), 0);
    const totalLucro = totalValorVenda - totalValorCompra;

    // Adiciona rodapé com totais
    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 30;
    doc.setFontSize(10);
    doc.setTextColor(corTexto[0], corTexto[1], corTexto[2]);
    doc.setFont('helvetica', 'bold');

    doc.setFillColor(245, 245, 245);
    doc.rect(10, finalY + 5, doc.internal.pageSize.getWidth() - 20, 20, 'F');

    doc.text('RESUMO GERAL', 15, finalY + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de Produtos: ${this.produtosFiltrados.length}`, 15, finalY + 17);
    doc.text(`Estoque Total: ${totalEstoque} unidades`, 15, finalY + 22);

    doc.text(`Valor Total (Compra): ${this.formatarMoeda(totalValorCompra)}`, 120, finalY + 17);
    doc.text(`Valor Total (Venda): ${this.formatarMoeda(totalValorVenda)}`, 120, finalY + 22);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(corSecundaria[0], corSecundaria[1], corSecundaria[2]);
    doc.text(`Lucro Total: ${this.formatarMoeda(totalLucro)}`, 220, finalY + 19);

    // Adiciona número de páginas
    const pageCount = (doc as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(corTextoClaro[0], corTextoClaro[1], corTextoClaro[2]);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 5,
        { align: 'center' }
      );
    }

    // Salva o PDF
    const dataAtualArquivo = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    doc.save(`produtos_${dataAtualArquivo}.pdf`);

    this.messageService.add({
      severity: 'success',
      summary: 'Exportação',
      detail: `PDF exportado com sucesso! ${this.produtosFiltrados.length} produto(s) exportado(s).`
    });
  }

  // Formata valores monetários
  private formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
