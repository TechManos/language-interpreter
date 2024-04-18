import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
// import {NotificationService} from "./notification.service";
import {from} from 'rxjs';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  // private notificationService = inject(NotificationService);
  private userService = inject(UserService);

  public getCurrentUserEmail(): string {
    return this.auth?.currentUser?.email!;
  }

  public isAuthenticated() {
    return !!this.auth.currentUser;
  }

  public getMyId(): string {
    return this.auth.currentUser?.uid!;
  }

  public login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public async logout(): Promise<void> {
    // await this.notificationService.deleteToken();
    return signOut(this.auth);
  }

  public async signUp(
    email: string,
    password: string,
    username: string
  ): Promise<UserCredential> {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          this.userService.create(userCredential.user.uid, email, username);

          // Resolve promise
          resolve(userCredential);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public initialAuthStateReady() {
    return from(this.auth.authStateReady());
  }
}
