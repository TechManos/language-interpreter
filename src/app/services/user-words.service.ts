import {Injectable, inject} from '@angular/core';
import {
  Database,
  getDatabase,
  list,
  orderByChild,
  push,
  query,
  ref,
  remove,
  serverTimestamp,
  set,
} from '@angular/fire/database';
import {QueryChange} from 'rxfire/database/interfaces';
import {BehaviorSubject, Observable, concatMap} from 'rxjs';
import {UserWordModel} from '../models/user-word.model';
import {convertToModel} from '../utils/convert.to.model';
import {AuthService} from './auth.service';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UserWordsService {
  private userWordsRealtime$!: BehaviorSubject<UserWordModel[]>;

  private readonly dbRef: Database = getDatabase();
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  public removeUserWord(id: string): void {
    remove(ref(this.dbRef, `user-words/${this.authService.getMyId()}/${id}`));
  }

  public addUserWord(word: string, explanation: string) {
    const newUserWordRef = push(
      ref(this.dbRef, `user-words/${this.authService.getMyId()}`)
    );
    set(newUserWordRef, {
      word: word,
      explanation: explanation,
      createdOn: serverTimestamp(),
    });
  }

  // public addUserGame(game: GameModel): void {
  //   const newUserGameRef = push(ref(this.dbRef, this.userGamesPath));
  //   set(newUserGameRef, {
  //     gameId: game.id,
  //     userUid: this.auth.currentUser?.uid!,
  //   });
  //   this.userGames$.value?.push({
  //     id: newUserGameRef.key,
  //     userUid: this.auth.currentUser?.uid!,
  //     game: {
  //       id: game.id,
  //       name: game.name,
  //     },
  //   } as UserGameModel);

  public getUserWordsRealtime$(): Observable<UserWordModel[]> {
    if (!this.userWordsRealtime$) {
      this.subscribeToUserWords();
    }
    return this.userWordsRealtime$.asObservable();
  }

  private subscribeToUserWords(): void {
    console.log('userWords service: subscribeToUserWords triggered...');

    this.userWordsRealtime$ = new BehaviorSubject<UserWordModel[]>(undefined!);
    // [DONE] TODO:
    //  Construct a reference to ordered by date user-words/userId
    //  Use 'list' to listen for changes and update our state with them
    const userWordsSortedQuery = query(
      ref(this.dbRef, `user-words/${this.authService.getMyId()}`),
      orderByChild('createdOn')
    );

    list(userWordsSortedQuery)
      .pipe(
        concatMap((queryChanges: QueryChange[]) => {
          const userWords: UserWordModel[] = [];
          queryChanges.forEach((change: QueryChange) => {
            console.log(
              `userWords service: sortedQueryChanges: change: ` +
                JSON.stringify(change)
            );

            // TODO: add some function to sort it, for now just emit new state
            userWords.push(convertToModel(change.snapshot) as UserWordModel);
          });

          userWords.reverse();

          console.log(
            `Finished fetching, here's words array REVERSED: ` +
              JSON.stringify(userWords)
          );

          this.userWordsRealtime$.next(userWords);

          return queryChanges;
        })
      )
      .subscribe();

    // const userGamesRefQuery = query(
    //   ref(this.dbRef, this.userGamesPath),
    //   orderByChild('userUid'),
    //   equalTo(this.auth.currentUser?.uid!)
    // );
    // return from(list(userGamesRefQuery)).pipe(
    //   take(1),
    //   concatMap((queryChanges: QueryChange[]) => {
    //     queryChanges.forEach((queryChange: QueryChange) =>
    //       gameIdsToExclude.push(queryChange.snapshot.val().gameId)
    //     );
    //     return from(list(ref(this.dbRef, this.gamesPath)));
    //   }),
    //   mergeMap((queryChanges: QueryChange[]) => {
    //     const games: GameModel[] = [];
    //     queryChanges.forEach((query: QueryChange) => {
    //       if (!gameIdsToExclude.includes(query.snapshot.key!)) {
    //         games.push(convertToModel(query.snapshot) as GameModel);
    //       }
    //     });
    //     this.games$.next(games);
    //     return this.games$.asObservable();
    //   })
    // );

    // const userWordsRef = ref(
    //   this.dbRef,
    //   `user-words/${this.authService.getMyId()}`
    // );

    // this.db.list(`/user-words/${userId}`, (ref) => ref.orderByChild('date'));

    // // 1) Get initial data
    // get(userWordsRef)
    //   .then((snapshot) => {
    //     if (snapshot.exists()) return snapshot;
    //     else throw new Error('WARN: No friendRequests yet');
    //   })
    //   .then((snapshot) => {
    //     const userWords: UserWordModel[] = [];
    //     snapshot.forEach((childSnapshot) => {
    //       userWords.push(convertToModel(childSnapshot) as UserWordModel);
    //     });
    //     this.userWordsRealtime$.next(userWords);
    //   })
    //   .catch((err) => {
    //     // Return error only for cases:
    //     if (err.message === 'Something went wrong') return err;
    //     return;
    //   });

    // // 2) Subscribe to changes

    // onValue(userWordsRef, (snapshot) => {
    //   const userWords: UserWordModel[] = [];
    //   snapshot.forEach((childSnapshot) => {
    //     userWords.push(convertToModel(childSnapshot) as UserWordModel);
    //   });
    //   this.userWordsRealtime$.next(userWords);
    // });
  }
}
