import { Empresa } from '../empresa';
import { Cliente } from '../cliente/cliente';

export interface EntradaEquipamento {
  id: number;
  idempresa: number;
  empresa: Empresa;
  idcliente: number;
  cliente: Cliente | null;
  equipamento: string;
  dataRecebimento: Date | null;
  descricaoProblema: string;
  observacoes: string;
}
