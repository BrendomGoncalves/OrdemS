import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Venda} from '../../models/venda';
import {generateUniqueId} from '../../ferramentas/utils';

@Injectable({
  providedIn: 'root'
})
export class VendasService {
  apiUrl = `${environment.apiUrl}/vendas`;

  constructor(private http: HttpClient) {
  }

  getVendas(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.apiUrl).pipe(
      map(vendas => vendas.sort((a, b) => {
        const dateA = a.data ? new Date(a.data).getTime() : 0;
        const dateB = b.data ? new Date(b.data).getTime() : 0;
        return dateA - dateB;
      }))
    );
  }

  getVendaById(id: string): Observable<Venda> {
    return this.http.get<Venda>(`${this.apiUrl}/${id}`);
  }

  addVenda(venda: Venda): Observable<Venda> {
    venda.id = generateUniqueId();
    return this.http.post<Venda>(this.apiUrl, venda).pipe(
      map(vendaAdicionada => {
        if (vendaAdicionada.id !== undefined) {
          vendaAdicionada.id = vendaAdicionada.id.toString();
        }
        return vendaAdicionada;
      })
    );
  }

  // updateVenda(id: string, venda: Venda): Observable<Venda> {
  //   return this.http.put<Venda>(`${this.apiUrl}/${id}`, venda).pipe(
  //     map(vendaAtualizada => {
  //       return vendaAtualizada;
  //     })
  //   );
  // }

  deleteVenda(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
