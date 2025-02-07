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

  async getProdutos(): Promise<Observable<Produto[]>> {
    return this.http.get<Produto[]>(this.apiUrl).pipe(
      map(produtos => produtos.sort((a, b) => a.nome.localeCompare(b.nome)))
    );
  }

  async getProdutoById(id: string): Promise<Observable<Produto>> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  async addProduto(produto: Produto): Promise<Observable<Produto>> {
    return this.http.post<Produto>(this.apiUrl, produto).pipe(
      map(produtoAdicionado => {
        if (produtoAdicionado.id !== undefined) {
          produtoAdicionado.id = produtoAdicionado.id.toString();
        }
        return produtoAdicionado;
      })
    )
  }

  async updateProduto(id: string, produto: Produto): Promise<Observable<Produto>> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto).pipe(
      map(produtoAtualizado => {
        return produtoAtualizado;
      })
    );
  }

  async deleteProduto(id: number): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  async baixarEstoque(produtos: Produto[]): Promise<Observable<void>> {
    const updateRequests = produtos.map(produto => {
      const novoEstoque = produto.estoque - produto.quantidadeVenda;
      return this.updateProduto(produto.id, {...produto, estoque: novoEstoque});
    });
    return forkJoin(updateRequests).pipe(map(() => {
    }));
  }

  async novoId(): Promise<string> {
    return new Promise<string>(async (resolve) => {
      (await this.getProdutos()).subscribe({
        next: (produtos) => {
          if (produtos.length > 0) {
            const novoId = (
              produtos
                .sort((a, b) => a.id.localeCompare(b.id))[produtos.length - 1]
                .id + 1
            ).toString();
            resolve(novoId);
          } else {
            resolve("1");
          }
        },
        error: () => {
          resolve("1");
        }
      });
    });
  }
}

