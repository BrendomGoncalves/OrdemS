import { Routes } from '@angular/router';
import {PaginaInicialComponent} from './pages/pagina-inicial/pagina-inicial.component';
import {ClientesListaComponent} from './pages/clientes-lista/clientes-lista.component';
import {OrdemServicoComponent} from './pages/ordem-servico/ordem-servico.component';
import {ServicosListaComponent} from './pages/servicos-lista/servicos-lista.component';
import {CategoriasListaComponent} from './pages/categorias-lista/categorias-lista.component';
import {ProdutosListaComponent} from './pages/produtos-lista/produtos-lista.component';
import {VendaProdutoComponent} from './pages/venda-produto/venda-produto.component';
import {VendasListaComponent} from './pages/vendas-lista/vendas-lista.component';
import {OrdemListaComponent} from './pages/ordem-lista/ordem-lista.component';
import {EntradaEquipamentoComponent} from './pages/entrada-equipamento/entrada-equipamento.component';
import {
  EntradasEquipamentosListaComponent
} from './pages/entradas-equipamentos-lista/entradas-equipamentos-lista.component';
import {PerfilComponent} from './pages/perfil/perfil.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pagina-inicial', pathMatch: 'full' },
  { path: 'pagina-inicial', component: PaginaInicialComponent },
  { path: 'perfil', component: PerfilComponent},
  { path: 'clientes', component: ClientesListaComponent },
  { path: 'produtos', component: ProdutosListaComponent},
  { path: 'venda-produto', component: VendaProdutoComponent },
  { path: 'vendas', component: VendasListaComponent},
  { path: 'servicos', component: ServicosListaComponent},
  { path: 'categorias', component: CategoriasListaComponent},
  { path: 'ordem-servico', component: OrdemServicoComponent},
  { path: 'ordem-servico/:id', component: OrdemServicoComponent},
  { path: 'ordem-servico/entrada-equipamento/:id', component: OrdemServicoComponent},
  { path: 'ordens', component: OrdemListaComponent},
  { path: 'entrada-equipamento', component: EntradaEquipamentoComponent},
  { path: 'entrada-equipamento/:id', component: EntradaEquipamentoComponent},
  { path: 'entradas-equipamentos', component: EntradasEquipamentosListaComponent},
  { path: '**', redirectTo: 'pagina-inicial' }
];
