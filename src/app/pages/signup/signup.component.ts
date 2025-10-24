import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

// Interface para tipar o FormGroup
interface SignupForm {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  passwordConfirm: FormControl<string>;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [
    LoginService
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignUpComponent {
  signupForm: FormGroup<SignupForm>;
  isSubmitting = false; // Flag para evitar submits múltiplos

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    // Inicializa o FormGroup com validadores
    this.signupForm = new FormGroup({
      name: new FormControl('', { validators: [Validators.required, Validators.minLength(3)], nonNullable: true }),
      email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true }),
      passwordConfirm: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true }),
    });
  }

  // Método auxiliar para acessar controles facilmente no template
  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get passwordConfirm() { return this.signupForm.get('passwordConfirm'); }

  submit() {
    // Marca todos os campos como 'touched' para mostrar erros imediatamente
    this.signupForm.markAllAsTouched();

    // Verificação manual de senhas coincidentes
    if (this.password?.value !== this.passwordConfirm?.value) {
      this.toastService.error("As senhas não coincidem.");
      return;
    }

    // Verifica se o formulário é válido
    if (this.signupForm.invalid) {
      this.toastService.error("Por favor, preencha todos os campos corretamente.");
      return;
    }

    // Prevenir múltiplos envios
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;

    // Chama o serviço de login (verifique se os parâmetros estão corretos para o seu serviço)
    // Assumindo que signup espera (name, email, password)
    this.loginService.signup(
      this.name?.value ?? '',
      this.email?.value ?? '',
      this.password?.value ?? ''
    ).subscribe({
      next: () => {
        this.toastService.success("Registro realizado com sucesso!");
        this.navigateToLogin();
      },
      error: (err) => {
        console.error('Erro no signup:', err);
        let errorMessage = 'Erro ao criar o usuário. Tente novamente.';
        // Adicione verificações específicas de erro do seu backend aqui, se necessário
        // Exemplo: if (err?.status === 409) { ... }
        this.toastService.error(errorMessage);
        this.isSubmitting = false; // Libera para novos submits em caso de erro
      }
      // Removido 'complete' para evitar redefinir isSubmitting após success
    });
  }

  navigateToLogin() {
    this.router.navigate(['/']);
  }
}
