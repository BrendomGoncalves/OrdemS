import {Categoria} from '../categoria/categoria';

export interface Servico{
  id: string
  nome: string
  idCategoria: number
  categoria: Categoria
  precoVenda: number
  observacoes: string
  quantidadeVenda: number | 1
  createdAt: Date
  updatedAt: Date
}
