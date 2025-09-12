import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nameValidator(): ValidatorFn {
  // Doit faire entre 2 et 50 caractères
  const NAME_PATTERN = /^[a-zA-Zà-žÀ-Ž' -]{2,50}$/;
  
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!NAME_PATTERN.test(value)) {
      return { invalidName: true };
    }
    return null;
  };
}
