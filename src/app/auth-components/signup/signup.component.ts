import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AuthService } from '../../auth-services/auth-service/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [NzSpinModule, ReactiveFormsModule, NzFormModule, NzButtonModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  isSpinning = false;
  validateForm!: FormGroup;

  constructor(
    private service: AuthService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      checkPassword: ['', [Validators.required, this.confirmationValidator.bind(this)]],
      name: ['', [Validators.required]]
    });
  }

  confirmationValidator(control: any): { [s: string]: boolean } | null {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm?.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return null;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log(this.validateForm.value);
      

      this.isSpinning = true;
      const { email, password, name } = this.validateForm.value;

      this.service.signup({ email, password, name }).subscribe({
        next: () => {
          this.isSpinning = false;
          this.message.success('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isSpinning = false;
          this.message.error(error.error?.message || 'Registration failed. Please try again.');
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls['checkPassword'].updateValueAndValidity());
  }
}
