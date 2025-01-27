import {Empresa} from './empresa';
import {Cliente} from './cliente';

export interface EntradaEquipamento {
  id: string
  empresa: Empresa
  cliente: Cliente | null
  equipamento: string
  dataRecebimento: Date | null
  descricaoProblema: string
}
