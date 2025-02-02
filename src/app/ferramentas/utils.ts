import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {delay, map, Observable, of} from 'rxjs';

/**
 * Gera uma string como id unico.
 * @example const id = generateUniqueId();
 * @returns Um id unico.
 */
export function generateUniqueId(): string {
  return Math.random().toString(36).slice(2, 9).toUpperCase();
}

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
