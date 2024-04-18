import {animate, style, transition, trigger} from '@angular/animations';
import {Component, OnInit, ViewChild, inject} from '@angular/core';
import {Router} from '@angular/router';
import {IonSearchbar, LoadingController} from '@ionic/angular';
import {Subject, debounceTime} from 'rxjs';
import {AiService} from '../services/ai.service';
import {AuthService} from '../services/auth.service';
import {UserWordsService} from '../services/user-words.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('fadeOut', [
      transition('* => void', [animate('0.5s', style({opacity: 0}))]),
    ]),
  ],
})
export class HomePage implements OnInit {
  @ViewChild('searchbar', {static: false}) searchbar!: IonSearchbar;

  public readonly loadingController = inject(LoadingController);
  public readonly userWords = inject(UserWordsService);
  public readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ai = inject(AiService);

  // Initialize a Subject to emit search queries
  private searchSubject = new Subject<string>();
  searchQuery: string = '';
  private readonly SIGN_IN_PATH = '';

  constructor() {}

  ngOnInit(): void {
    // Subscribe to the searchSubject and debounce the input
    this.searchSubject
      .pipe(
        debounceTime(300) // Adjust the debounce time as needed
      )
      .subscribe((value) => {
        this.performSearch(value);
      });
  }

  async onEnterPressed(event: any) {
    console.log('Enter pressed! Value: ', event.target.value);

    // Emit the value into the searchSubject
    this.searchSubject.next(event.target.value);

    // Clear the search bar
    (await this.searchbar.getInputElement()).value = '';
  }

  async performSearch(value: string) {
    const loading = await this.loadingController.create();
    await loading.present();

    // Your search logic here
    const response = await this.ai.postMessage(value);
    // this.userWords.addUserWord(value, response?.choices[0]?.message?.content);
    // this.data.appendMessage(value, response);
    this.userWords.addUserWord(value, response?.choices[0]?.message?.content);

    await this.loadingController.dismiss();
    this.searchbar.setFocus();
  }

  public async logOut(): Promise<void> {
    try {
      const loading = await this.loadingController.create();
      await loading.present();

      await this.authService.logout();

      // Clear all caches
      window.location.reload();

      this.router.navigateByUrl(this.SIGN_IN_PATH, {replaceUrl: true});
    } catch (err) {
      console.error(err);
    } finally {
      await this.loadingController.dismiss();
    }
  }

  stringifyObj(obj: any) {
    return JSON.stringify(obj);
  }
}
