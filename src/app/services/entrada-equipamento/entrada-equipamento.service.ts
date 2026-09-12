import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { EntradaEquipamento } from '../../models/entrada-equipamento/entrada-equipamento';

@Injectable({
  providedIn: 'root',
})
export class EntradaEquipamentoService {
  private apiUrl = `${environment.apiUrl}/entradas-equipamentos`;

  constructor(private http: HttpClient) {}

  async getEntradasEquipamentos(): Promise<Observable<EntradaEquipamento[]>> {
    return this.http
      .get<EntradaEquipamento[]>(this.apiUrl)
      .pipe(
        map((entradasEquipamentos) =>
          entradasEquipamentos.sort((a, b) =>
            a.cliente!.nome.localeCompare(b.cliente!.nome),
          ),
        ),
      );
  }

  async getEntradaEquipamentoById(
    id: number,
  ): Promise<Observable<EntradaEquipamento>> {
    return this.http.get<EntradaEquipamento>(`${this.apiUrl}/${id}`);
  }

  async addEntradaEquipamento(
    entradaEquipamento: EntradaEquipamento,
  ): Promise<Observable<EntradaEquipamento>> {
    return this.http.post<EntradaEquipamento>(this.apiUrl, entradaEquipamento);
  }

  async updateEntradaEquipamento(
    id: number | undefined,
    ordem: EntradaEquipamento,
  ): Promise<Observable<EntradaEquipamento>> {
    return this.http
      .put<EntradaEquipamento>(`${this.apiUrl}/${id}`, ordem)
      .pipe(
        map((entradaEquipamentoAtualizada) => {
          return entradaEquipamentoAtualizada;
        }),
      );
  }

  async deleteEntradaEquipamento(id: number): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
