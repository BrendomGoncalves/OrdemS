import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {delay, map, Observable, of} from 'rxjs';

/**
 * Função assíncrona que valida um campo.
 * @example nome: ['', [Validators.required], [asyncValidator()]]
 * @returns Um observable com o resultado da validação.
 */
export function asyncValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.value).pipe(
      delay(1000),
      map(value => {
        return value === 'invalid' ? {invalidAsync: true} : null;
      })
    );
  };
}

/**
 * Verifica se um objeto possui propriedades com valores nulos ou indefinidos.
 * @param obj Objeto a ser verificado.
 * @returns true se o objeto possui propriedades com valores nulos ou indefinidos, false caso contrário.
 */
export function hasNullProperties(obj: Record<string, any>): boolean {
  for (const key in obj) {
    if (obj[key] == null || obj[key] === '') { // null ou undefined
      return true;
    }
  }
  return false;
}
