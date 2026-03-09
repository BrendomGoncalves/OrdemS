export interface ServicoCreateDto {
  nome: string
  idCategoria: number
  precoVenda: number
  observacoes: string
  quantidadeVenda: number | 1
}
