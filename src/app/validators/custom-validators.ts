import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export class CustomValidators {
  
  // Synchronous validators
  static noWhitespace(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    
    if (!value) {
      return null; // Let required validator handle empty values
    }

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);
    const isLengthValid = value.length >= 8;

    const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isLengthValid;

    if (!passwordValid) {
      return {
        strongPassword: {
          hasNumber,
          hasUpper,
          hasLower,
          hasSpecial,
          isLengthValid
        }
      };
    }

    return null;
  }

  static phoneNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    
    if (!value) {
      return null;
    }

    // Support various phone formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
    
    return phoneRegex.test(cleanPhone) ? null : { phoneNumber: true };
  }

  static minimumAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const today = new Date();
      const birthDate = new Date(control.value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      let actualAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        actualAge--;
      }

      return actualAge >= minAge ? null : { minimumAge: { requiredAge: minAge, actualAge } };
    };
  }

  static urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  }

  static salaryRange(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      if (value < min || value > max) {
        return { salaryRange: { min, max, actual: value } };
      }

      return null;
    };
  }

  static arrayMinLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!Array.isArray(value)) {
        return null;
      }

      return value.length >= minLength ? null : { arrayMinLength: { requiredLength: minLength, actualLength: value.length } };
    };
  }

  // Cross-field validator
  static passwordMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    };
  }

  // Async validators
  static asyncEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // Simulate async email validation
      return timer(500).pipe(
        switchMap(() => {
          // Simulate checking against a list of taken emails
          const takenEmails = ['admin@example.com', 'test@example.com', 'user@example.com'];
          const isEmailTaken = takenEmails.includes(control.value.toLowerCase());
          
          return of(isEmailTaken ? { emailTaken: true } : null);
        })
      );
    };
  }

  static asyncUsernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(800).pipe(
        switchMap(() => {
          // Simulate checking username availability
          const takenUsernames = ['admin', 'user', 'test', 'demo'];
          const isUsernameTaken = takenUsernames.includes(control.value.toLowerCase());
          
          return of(isUsernameTaken ? { usernameTaken: true } : null);
        })
      );
    };
  }
}
