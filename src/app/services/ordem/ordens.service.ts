import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {OrdemServico} from '../../models/ordem-servico';

@Injectable({
  providedIn: 'root'
})
export class OrdensService {
  private apiUrl = `${environment.apiUrl}/ordens`;

  constructor(private http: HttpClient) {}

  getOrdens(): Observable<OrdemServico[]>{
    return this.http.get<OrdemServico[]>(this.apiUrl).pipe(
      map(ordens => ordens.sort((a, b) => a.cliente!.nome.localeCompare(b.cliente!.nome)))
    );
  }

  getOrdemById(id: string): Observable<OrdemServico> {
    return this.http.get<OrdemServico>(`${this.apiUrl}/${id}`);
  }

  addOrdem(ordem: OrdemServico): Observable<OrdemServico> {
    return this.http.post<OrdemServico>(this.apiUrl, ordem).pipe(
      map(ordemAdicionada => {
        if(ordemAdicionada.id !== undefined) {
          ordemAdicionada.id = ordemAdicionada.id.toString();
        }
        return ordemAdicionada;
      })
    );
  }

  updateOrdem(id: number | undefined, ordem: OrdemServico): Observable<OrdemServico>{
    return this.http.put<OrdemServico>(`${this.apiUrl}/${id}`, ordem).pipe(
      map(ordemAtualizada => {
        return ordemAtualizada;
      })
    );
  }

  deleteOrdem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
