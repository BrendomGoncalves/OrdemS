import {Injectable} from '@angular/core';
import {Servico} from '../../models/servico/servico';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ServicoCreateDto} from '../../models/servico/servicoCreateDto';
import {CategoriasService} from '../categoria/categorias.service';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {
  private apiUrl = `${environment.apiUrl}/servicos`;

  constructor(private http: HttpClient, private categoriasService: CategoriasService) {}

  async getServicos(): Promise<Observable<Servico[]>> {
    return this.http.get<Servico[]>(this.apiUrl).pipe(
      map(servicos => {
        servicos.forEach(async (servico: Servico) => {
          (await this.categoriasService.getCategoriaById(servico.idCategoria)).subscribe(categoria => {
            servico.categoria = categoria;
          });
        })
        return servicos;
      })
    );
  }

  async getServicoById(id: string): Promise<Observable<Servico>> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`);
  }

  async addServico(servico: ServicoCreateDto): Promise<Observable<ServicoCreateDto>> {
    return this.http.post<ServicoCreateDto>(this.apiUrl, servico).pipe(
      map(servicoAdicionado => {
        return servicoAdicionado;
      })
    )
  }

  async updateServico(id: number, servico: ServicoCreateDto): Promise<Observable<ServicoCreateDto>> {
    return this.http.put<ServicoCreateDto>(`${this.apiUrl}/${id}`, servico).pipe(
      map(servicoAtualizado => {
        return servicoAtualizado;
      })
    );
  }

  async deleteServico(id: number): Promise<Observable<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
