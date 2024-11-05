import {Categoria} from './categoria';

export interface Servico{
  id: number
  nome: string
  categoria: Categoria
  precoVenda: number
  observacoes: string
  dataCadastro: Date
}
