import {Injectable} from '@angular/core';
import {LOCALE} from '../consts/local-storage-keys.const';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  public getLocale(): string {
    // TODO: currently I do not save anything here, so it'll always be 'en'
    const res = localStorage.getItem(LOCALE) || 'en';
    console.log(`Local service: result of operation: ${res}`);

    return localStorage.getItem(LOCALE) || 'en';
  }

  public setLocale(locale: string): void {
    localStorage.setItem(LOCALE, locale);
  }
}
