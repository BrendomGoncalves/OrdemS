import {Categoria} from './categoria';

export interface Servico{
  id: string
  nome: string
  categoria: Categoria
  precoVenda: number
  observacoes: string
  dataCadastro: Date
  quantidadeVenda: number | 1
}
