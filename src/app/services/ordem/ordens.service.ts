import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {OrdemServico} from '../../models/ordem-servico';
import {Servico} from '../../models/servico/servico';

@Injectable({
  providedIn: 'root'
})
export class OrdensService {
  private apiUrl = `${environment.apiUrl}/ordens`;

  constructor(private http: HttpClient) {
  }

  async getOrdens(): Promise<Observable<OrdemServico[]>> {
    return this.http.get<OrdemServico[]>(this.apiUrl).pipe(
      map(ordens => ordens.sort((a, b) => a.cliente!.nome.localeCompare(b.cliente!.nome)))
    );
  }

  async getOrdemById(id: string): Promise<Observable<OrdemServico>> {
    return this.http.get<OrdemServico>(`${this.apiUrl}/${id}`);
  }

  async addOrdem(ordem: OrdemServico): Promise<Observable<OrdemServico>> {
    return this.http.post<OrdemServico>(this.apiUrl, ordem).pipe(
      map(ordemAdicionada => {
        if (ordemAdicionada.id !== undefined) {
          ordemAdicionada.id = ordemAdicionada.id.toString();
        }
        return ordemAdicionada;
      })
    );
  }

  async updateOrdem(id: string | undefined, ordem: OrdemServico): Promise<Observable<OrdemServico>> {
    return this.http.put<OrdemServico>(`${this.apiUrl}/${id}`, ordem).pipe(
      map(ordemAtualizada => {
        return ordemAtualizada;
      })
    );
  }

  async deleteOrdem(id: string): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // TODO: REMOVER GERAÇÂO DE ID
  async novoId(): Promise<string> {
    return new Promise<string>(async (resolve) => {
      (await this.getOrdens()).subscribe({
        next: (ordens) => {
          if (ordens.length > 0) {
            const novoId = (
              ordens
                .sort((a, b) => a.id.localeCompare(b.id))[ordens.length - 1]
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

  async chartCalcularMaisVendidos(): Promise<[Servico, number][]> {
    return new Promise(async (resolve, reject) => {
      (await this.getOrdens()).subscribe({
        next: (ordens) => {
          const maisVendidos = this.getServicosOrdens(ordens).slice(0, 3).sort((a, b) => b[1] - a[1]);
          resolve(maisVendidos);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  private getServicosOrdens(ordens: OrdemServico[]): [Servico, number][] {
    return ordens.map(ordem => ordem.servicos).flat().reduce<[Servico, number][]>((acc, servico) => {
      const index = acc.findIndex(item => item[0].id === servico.id);
      if (index !== -1) {
        acc[index][1]++;
      } else {
        acc.push([servico as Servico, 1]);
      }
      return acc;
    }, []);
  }
}
