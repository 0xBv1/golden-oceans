import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    private _DataService: DataService,
    private _AuthService: AuthService,
    private toastr: ToastrService,
    private _Router: Router
  ) {}

  logo!: any;
  siteTitle!: any;
  isLoading = false;
  countryList: any[] = [];

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.getSettings();
    this.getCountries();
  }

  getSettings(): void {
    this._DataService.getSetting().subscribe({
      next: (res) => {
        console.log(res.data);

        const contactLogo = res.data.find(
          (item: any) => item.option_key === 'logo'
        );
        this.logo = contactLogo?.option_value[0];

        const title = res.data.find(
          (item: any) => item.option_key === 'site_title'
        );
        this.siteTitle = title?.option_value[0];

        // console.log(this.logo);
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }

  getCountries() {
    this._DataService.getCountries().subscribe({
      next: (response) => {
        console.log(response.data);
        this.countryList = response.data;
      },
    });
  }

  handleLoginForm(): void {
    if (this.loginForm.valid) {
      // console.log(this.loginForm.value);
      this.isLoading = true;
      this._AuthService.setlogin(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.status === true) {
            this._AuthService.loginSuccess(response);
            this.toastr.success(response.message);
            this._Router.navigate(['']);
            console.log(localStorage.getItem('accessToken'));
          } else {
            this.toastr.error('Login failed');
          }
        },
        error: (err) => {
          this.toastr.error(err?.error?.message ?? 'Login error');
        },
      });
    }
  }

  handleForgetPass(email: any): void {
    console.log(email);
    this._AuthService.setForgetPass(email).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success(res.message);
      },
    });
  }
}
