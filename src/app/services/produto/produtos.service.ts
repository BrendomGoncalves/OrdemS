import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {forkJoin, map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Produto} from "../../models/produto";

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private apiUrl = `${environment.apiUrl}/produtos`;

  constructor(private http: HttpClient) {
  }

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl).pipe(
      map(produtos => produtos.sort((a, b) => a.nome.localeCompare(b.nome)))
    );
  }

  getProdutoById(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  addProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto).pipe(
      map(produtoAdicionado => {
        if (produtoAdicionado.id !== undefined) {
          produtoAdicionado.id = produtoAdicionado.id.toString();
        }
        return produtoAdicionado;
      })
    )
  }

  updateProduto(id: string, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto).pipe(
      map(produtoAtualizado => {
        return produtoAtualizado;
      })
    );
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  baixarEstoque(produtos: Produto[]): Observable<void> {
    const updateRequests = produtos.map(produto => {
      const novoEstoque = produto.estoque - produto.quantidadeVenda;
      return this.updateProduto(produto.id, {...produto, estoque: novoEstoque});
    });
    return forkJoin(updateRequests).pipe(map(() => {
    }));
  }
}

