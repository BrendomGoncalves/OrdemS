import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Empresa} from '../../models/empresa';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${environment.apiUrl}/empresa`;

  constructor(private http: HttpClient) {
  }

  async getEmpresa() {
    return this.http.get<Empresa>(this.apiUrl);
  }

  async updateEmpresa(empresa: Empresa) {
    return this.http.put<Empresa>(this.apiUrl, empresa).pipe(
      map(empresaAtualizada => {
        return empresaAtualizada;
      }));
  }

  exportarDados() {
    const resources = ['empresa', 'clientes', 'servicos', 'categorias', 'produtos', 'vendas', 'ordens', 'entradas-equipamentos'];

    Promise.all(resources.map(resource => fetch(`${environment.apiUrl}/${resource}`).then(response => response.json())))
      .then(data => {
        const backupData: { [key: string]: any } = {};

        resources.forEach((resource, index) => {
          backupData[resource] = data[index];
        });

        const blob = new Blob([JSON.stringify(backupData, null, 2)], {type: 'application/json'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'db.json';
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Erro ao obter dados:', error));
  }

  importarDados(event: any) {
      const file = event.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const backupData = JSON.parse(result);
          const resources = Object.keys(backupData);

          Promise.all(resources.map(resource =>
            fetch(`${environment.apiUrl}/${resource}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(backupData[resource])
            }).then(response => response.json())
          ))
            .then(() => console.log('Dados importados com sucesso!'))
            .catch(error => console.error('Erro ao importar dados:', error));
        };
        reader.readAsText(file);
      } else {
        console.error('Arquivo não encontrado')
      }
  }

  // exportData() {
  //   this.http.get(`${environment.apiUrl}/db`).subscribe(data => {
  //     const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'backup.json';
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   });
  // }

  // importData(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const data = JSON.parse(e.target.result);
  //       this.http.post(`${environment.apiUrl}/db`, data).subscribe(response => {
  //         console.log('Dados importados com sucesso!', response);
  //       });
  //     };
  //     reader.readAsText(file);
  //   }
  // }
}
