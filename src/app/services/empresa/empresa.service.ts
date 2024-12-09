import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Empresa} from '../../models/empresa';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${environment.apiUrl}/empresa`;

  constructor(private http: HttpClient) {}

  async getEmpresa(){
    return this.http.get<Empresa>(this.apiUrl);
  }

  updateEmpresa(empresa: Empresa){
    return this.http.put<Empresa>(this.apiUrl, empresa).pipe(
      map(empresaAtualizada => { return empresaAtualizada; }));
  }
}
