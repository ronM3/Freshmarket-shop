import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
    
export default class Validation {
    static match(controlName: string, checkControlName: string): ValidatorFn {

      return (controls: AbstractControl) => {
          
        const control = controls.get(controlName);
        const checkControl = controls.get(checkControlName);
        
  
        if (checkControl?.errors && !checkControl?.errors['matching']) {
          return null;
        }
  
        if (control?.value !== checkControl?.value) {
          controls.get(checkControlName)?.setErrors({ matching: true });
          return { matching: true };
        } else {
          return null;
        }
      };
    }
  }

// export const passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
//     const password = control.get('password');
//     const confirmPassword = control.get('passwordConfirm');
//   console.log(password)
//   console.log(confirmPassword)
//     return password?.value === confirmPassword?.value ? null : { notmatched: true };
//   };

// confirmEquals(){
//     return (control: AbstractControl): { [key: string]: any } | null =>  
//         control.value?.toLowerCase() === this.passwordField.toLowerCase() 
//             ? null : {noMatch: true};
//   }
