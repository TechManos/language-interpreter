import {Component, ElementRef, OnInit, ViewChild, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
// import {marker} from "@colsen1991/ngx-translate-extract-marker";
import {AlertController} from '@ionic/angular';
// import {USER_PROFILE_PATH} from 'src/app/consts/routes.const';
import {AuthService} from 'src/app/services/auth.service';
import {UserService} from 'src/app/services/user.service';
// import {TranslateService} from "@ngx-translate/core";
import {LoadingService} from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
  // Accessing the button using ViewChild and the reference variable
  @ViewChild('loginBtn', {static: false}) loginBtn!: ElementRef;
  @ViewChild('signUpBtn', {static: false}) signUpBtn!: ElementRef;

  public authView = 'login';
  public credentialsFormGroup!: FormGroup;
  public isAuthenticated!: boolean;

  private readonly LOGGED_IN_PATH = 'home';

  private readonly fb = inject(FormBuilder);
  private readonly loadingService = inject(LoadingService);
  private readonly alertController = inject(AlertController);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  // private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    this.credentialsFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // let's say that usernames with length <=2 are system/admin reserved
      username: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.isAuthenticated = this.authService.isAuthenticated();
  }

  // Easy access for form fields
  public get email() {
    return this.credentialsFormGroup.get('email');
  }

  public get password() {
    return this.credentialsFormGroup.get('password');
  }

  public get username() {
    return this.credentialsFormGroup.get('username');
  }

  public segmentChanged(ev: any): void {
    this.authView = ev!.detail!.value!;
  }

  public async signUp(): Promise<void> {
    try {
      this.loadingService.setLoading(true);

      // TODO: we don't need it because we can utilize the error from SignUp
      // const isUsernameInUse = await firstValueFrom(
      //   this.userService.isUsernameInUse$(
      //     this.credentialsFormGroup.value.username
      //   )
      // );
      // if (isUsernameInUse) {
      //   this.showAlert(
      //     'error.message.registration.failed',
      //     'error.message.detail.username.in.use'
      //   );
      //   return;
      // }

      const {email, password, username} = this.credentialsFormGroup.value;
      await this.authService.signUp(email, password, username);

      this.router.navigateByUrl(this.LOGGED_IN_PATH, {replaceUrl: true});
    } catch (err) {
      console.error(err);
      console.error(JSON.stringify(err));
      this.showAlert(
        'error.message.registration.failed',
        'error.message.detail.try.again'
      );
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  public async logIn() {
    try {
      this.loadingService.setLoading(true);

      const {email, password} = this.credentialsFormGroup.value;
      await this.authService.login(email, password);

      this.router.navigateByUrl(this.LOGGED_IN_PATH, {replaceUrl: true});
    } catch (err) {
      this.showAlert(
        'error.message.login.failed',
        'error.message.detail.try.again'
      );
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  public async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  loginOnEnterPressed() {
    console.log('Yurii - login enterPressed');
    // Ensure the element is available
    if (this.loginBtn && this.loginBtn.nativeElement) {
      this.loginBtn.nativeElement.click();
    }
  }

  signUpOnEnterPressed() {
    // Ensure the element is available
    console.log('Yurii - login enterPressed');
    if (this.signUpBtn && this.signUpBtn.nativeElement) {
      this.signUpBtn.nativeElement.click();
    }
  }
}
