import {inject, Injectable} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {
  Database,
  DataSnapshot,
  equalTo,
  get,
  getDatabase,
  orderByChild,
  push,
  query,
  ref,
  set,
} from 'firebase/database';
import {
  BehaviorSubject,
  concatMap,
  from,
  map,
  Observable,
  of,
  take,
} from 'rxjs';
import {UserModel} from '../models/user.model';
import {convertToModel} from '../utils/convert.to.model';
// import {convertToModel} from '../convertors/convert.to.model';
// import {UserModel} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private cachedMe: UserModel | undefined;
  // private cachedMe: any | undefined;
  private currentUser$!: BehaviorSubject<UserModel>;

  // private storage: FirebaseStorage = getStorage();
  private dbRef: Database = getDatabase();
  private auth = inject(Auth);

  // public uploadUserImg$(imageBase64: string): Observable<string> {
  //   const userUid = this.auth.currentUser!.uid;
  //   const userImgRef = storageRef(this.storage, `images/${userUid}`);
  //   return from(uploadString(userImgRef, imageBase64, 'data_url')).pipe(
  //     take(1),
  //     concatMap(() => this.getUserImg$(userUid)),
  //     tap((imgUrl: string) => (this.cachedMe!.avatarUrl = imgUrl))
  //   );
  // }

  public create(id: string, email: string, username: string): Promise<void> {
    const user: {[key: string]: any} = {
      username: username,
      email: email,
    };

    return set(ref(this.dbRef, 'users/' + id), user);
  }

  public addFriend(friendUsername: string): Promise<void> {
    const usersRef = ref(this.dbRef, 'users');
    const queryFriendRef = query(
      usersRef,
      orderByChild('username'),
      equalTo(friendUsername)
    );

    return get(queryFriendRef)
      .then((snapshot) => {
        if (snapshot.exists()) return snapshot;
        else throw new Error('Invalid friend username');
      })
      .then(() => {
        const userFriendsRef = ref(
          this.dbRef,
          `users/${this.auth.currentUser?.uid}/friends`
        );
        const newFriendRef = push(userFriendsRef);

        return set(newFriendRef, {
          username: friendUsername,
          ignored: false,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public isUsernameInUse$(username: string): Observable<boolean> {
    const usersRef = ref(this.dbRef, 'users');
    const queryByUsernameRef = query(
      usersRef,
      orderByChild('username'),
      equalTo(username)
    );

    return from(get(queryByUsernameRef)).pipe(
      take(1),
      map((snapshot: DataSnapshot) => snapshot.exists())
    );
  }

  /**
   * Gets and caches your user as a data model. Use it ONLY when authenticated.
   *
   * @returns Observable<UserModel> with you
   */
  // public getMe$(): Observable<UserModel> {
  public getMe$(): Observable<UserModel> {
    console.log('getMe triggered.');

    if (!this.currentUser$) {
      this.currentUser$ = new BehaviorSubject<UserModel>(undefined!);

      const userRef = ref(this.dbRef, `users/${this.auth.currentUser!.uid}`);
      from(get(userRef))
        .pipe(
          take(1),
          concatMap((snapshot: DataSnapshot) => {
            // this.cachedMe = convertToModel(snapshot) as UserModel;
            this.currentUser$.next(convertToModel(snapshot) as UserModel);
            console.log(
              'getMe: ' + JSON.stringify(this.currentUser$.getValue())
            );
            return of(snapshot);
          })
        )
        .subscribe();
    }

    return this.currentUser$.asObservable();
  }

  // private getUserImg$(userUid: string): Observable<string> {
  //   const userImgRef = storageRef(this.storage, `images/${userUid}`);
  //   return from(getDownloadURL(userImgRef));
  // }
}
