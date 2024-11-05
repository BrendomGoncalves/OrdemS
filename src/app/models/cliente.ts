export abstract class Cliente {
  id?: number;
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
  dataCadastro: Date;

  protected constructor(nome: string, fantasia: string, cnpj: string, cpf: string, ie: string, celular: string, telefone: string, email: string, endereco: string, numero: string, bairro: string, cidade: string, observacoes: string, tipoCliente: 'PF' | 'PJ', dataCadastro: Date) {
    this.nome = nome;
    this.fantasia = fantasia;
    this.cnpj = cnpj;
    this.cpf = cpf;
    this.ie = ie;
    this.celular = celular;
    this.telefone = telefone;
    this.email = email;
    this.endereco = endereco;
    this.numero = numero;
    this.bairro = bairro;
    this.cidade = cidade;
    this.observacoes = observacoes;
    this.tipoCliente = tipoCliente;
    this.dataCadastro = dataCadastro;
  }
}
