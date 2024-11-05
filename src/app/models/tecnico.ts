import {DisponibilidadeEnum} from './disponibilidadeEnum';

export interface Tecnico{
  id: number
  nome: string
  especialidade: string
  disponibilidade: DisponibilidadeEnum.DISPONIVEL
}
