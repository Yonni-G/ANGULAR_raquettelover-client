import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function codeLieuValidator(): ValidatorFn {
  // Doit faire entre 2 et 50 caractères
  const NAME_PATTERN = /^[a-z-]{2,50}$/;
  
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!NAME_PATTERN.test(value)) {
      return { invalidCodeLieu: true };
    }
    return null;
  };
}
