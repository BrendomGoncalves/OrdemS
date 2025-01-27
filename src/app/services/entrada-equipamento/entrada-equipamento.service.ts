import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {EntradaEquipamento} from '../../models/entrada-equipamento';

@Injectable({
  providedIn: 'root'
})
export class EntradaEquipamentoService {
  private apiUrl = `${environment.apiUrl}/entradas-equipamentos`;

  constructor(private http: HttpClient) {}

  async getEntradasEquipamentos(): Promise<Observable<EntradaEquipamento[]>>{
    return this.http.get<EntradaEquipamento[]>(this.apiUrl).pipe(
      map(entradasEquipamentos => entradasEquipamentos.sort((a, b) => a.cliente!.nome.localeCompare(b.cliente!.nome)))
    );
  }

  async getEntradaEquipamentoById(id: string): Promise<Observable<EntradaEquipamento>> {
    return this.http.get<EntradaEquipamento>(`${this.apiUrl}/${id}`);
  }

  async addEntradaEquipamento(entradaEquipamento: EntradaEquipamento): Promise<Observable<EntradaEquipamento>> {
    return this.http.post<EntradaEquipamento>(this.apiUrl, entradaEquipamento).pipe(
      map(entradaEquipamentoAdicionada => {
        if(entradaEquipamentoAdicionada.id !== undefined) {
          entradaEquipamentoAdicionada.id = entradaEquipamentoAdicionada.id.toString();
        }
        return entradaEquipamentoAdicionada;
      })
    );
  }

  async updateEntradaEquipamento(id: string | undefined, ordem: EntradaEquipamento): Promise<Observable<EntradaEquipamento>>{
    return this.http.put<EntradaEquipamento>(`${this.apiUrl}/${id}`, ordem).pipe(
      map(entradaEquipamentoAtualizada => {
        return entradaEquipamentoAtualizada;
      })
    );
  }

  async deleteEntradaEquipamento(id: string): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // REMOVER GERAÇÂO DE ID
  async novoId() {
    let lentradasEquipamentos: EntradaEquipamento[] = [];
    (await this.getEntradasEquipamentos()).subscribe((entradasEquipamentos: any[]) => {
      lentradasEquipamentos = entradasEquipamentos
    })
    if (lentradasEquipamentos.length > 0) {
      return (
        lentradasEquipamentos
          .sort((a, b) => a.id
            .localeCompare(b.id))[lentradasEquipamentos.length - 1]
          .id + 1)
        .toString();
    }
    return "1";
  }
}
