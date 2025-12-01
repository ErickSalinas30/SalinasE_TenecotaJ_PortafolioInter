import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);


  constructor() {
    const user = this.authService.currentUser;

    if (user) {

      this.router.navigate(['/']);
    }
  }


  async login() {
    const result = await this.authService.loginWithGoogle();

    if (!result) return;

    const user = this.authService.currentUser;

    if (user.role === 'admin') {
      this.router.navigate(['/admin']);
      return;
    }

    if (user.role === 'programador') {
      this.router.navigate(['/programador']);
      return;
    }

    this.router.navigate(['/']);
  }

}
