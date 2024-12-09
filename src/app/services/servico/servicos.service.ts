import {Injectable} from '@angular/core';
import {Servico} from '../../models/servico';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {
  private apiUrl = `${environment.apiUrl}/servicos`;

  constructor(private http: HttpClient) {}

  async getServicos(): Promise<Observable<Servico[]>> {
    return this.http.get<Servico[]>(this.apiUrl).pipe(
      map(servicos => servicos.sort((a, b) => a.nome.localeCompare(b.nome)))
    );
  }

  getServicoById(id: string): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`);
  }

  addServico(servico: Servico): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, servico).pipe(
      map(servicoAdicionado => {
        if(servicoAdicionado.id !== undefined) {
          servicoAdicionado.id = servicoAdicionado.id.toString();
        }
        return servicoAdicionado;
      })
    )
  }

  updateServico(id: number | undefined, servico: Servico): Observable<Servico>{
    return this.http.put<Servico>(`${this.apiUrl}/${id}`, servico).pipe(
      map(servicoAtualizado => {
        return servicoAtualizado;
      })
    );
  }

  deleteServico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
