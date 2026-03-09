export interface ClienteCreateDto {
  nome: string;
  fantasia: string;
  cnpj: string;
  ie: string;
  cpf: string;
  celular: string;
  telefone: string;
  email: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  observacoes: string;
  tipoCliente: 'PF' | 'PJ';
}
