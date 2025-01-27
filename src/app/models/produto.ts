export interface Produto{
  id: string
  nome: string
  precoCompra: number
  precoVenda: number
  lucro: number
  estoque: number
  quantidadeVenda: number | 1
  observacoes: string
}
