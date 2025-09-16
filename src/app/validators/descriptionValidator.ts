import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function descriptionValidator(): ValidatorFn {
  // PATTERN POUR UNE adresse qui faire entre 20 et 100 caractères
  const PATTERN = /^.{20,100}$/;
  
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!PATTERN.test(value)) {
      return { invalidDescription: true };
    }
    return null;
  };
}
