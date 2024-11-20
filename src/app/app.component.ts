import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  Subject,
} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'rxjs_angular';

  ngOnInit(): void {
    // 1. Observables
    const myObservable = new Observable((observer) => {
      observer.next('Hello');
      observer.next('World');
      observer.complete();
    });

    myObservable.subscribe({
      next: (value) => console.log(value), // Logs 'Hello' and 'World'
      complete: () => console.log('Completed'), // Logs 'Completed'
    });

    // 2. Operators
    /*
    map: Transforms the items emitted by an Observable.
    filter: Filters items based on a condition.
    mergeMap / switchMap / concatMap: Flattening operators for handling inner Observables.
    catchError: To handle errors.
    debounceTime: To handle delays in emitting values.
    */
    const numbers = of(1, 2, 3, 4, 5);
    numbers
      .pipe(
        filter((n) => n % 2 === 0), // Filter even numbers
        map((n) => n * 2) // Double the numbers
      )
      .subscribe(console.log); // Output: 4, 8

    // 3. Subjects
    // A Subject is a type of Observable that allows you to multicast values to multiple observers. It’s like a bridge between the producer and multiple consumers.
    /*
   Subject: Basic type of Subject.
   BehaviorSubject: Stores the latest value emitted and emits it immediately to new subscribers.
   ReplaySubject: Replay a specified number of previous emissions to new subscribers.
   AsyncSubject: Emits the last value to observers when the source Observable completes.
   */

    const subject = new BehaviorSubject('Initial Value');
    subject.subscribe((value) => console.log(`Subscriber 1: ${value}`));
    subject.next('Updated Value');
    subject.subscribe((value) => console.log(`Subscriber 2: ${value}`));
    subject.next('Final Value');

    // 4. Hot vs Cold Observables
    // Cold Observable: Each observer gets a fresh execution of the Observable. Each subscription starts its own independent stream.
    // Hot Observable: The Observable is shared by all observers, meaning it doesn’t start a new execution for each subscriber.
    const coldObservable = new Observable((observer) => {
      console.log('Observable is being executed');
      observer.next('Hello');
    });

    coldObservable.subscribe((value) => console.log(value)); // Logs 'Observable is being executed' and 'Hello'
    coldObservable.subscribe((value) => console.log(value)); // Logs 'Observable is being executed' and 'Hello' again

    const hotSubject = new Subject();
    hotSubject.subscribe((value) => console.log(`Subscriber 1: ${value}`));
    hotSubject.next('Hello');
    hotSubject.subscribe((value) => console.log(`Subscriber 2: ${value}`));
    hotSubject.next('World');

    // 6. Handling Errors in RxJS
    const observableWithError = new Observable((observer) => {
      observer.next('Before Error');
      observer.error('Something went wrong!');
    });
    observableWithError
      .pipe(
        catchError((err) => {
          console.log('Caught error:', err);
          return of('Fallback value'); // Returning a fallback value
        })
      )
      .subscribe({
        next: (value) => console.log(value),
        error: (err) => console.log('Error:', err),
      });

    // 7. Combining Observables
    /*
    combineLatest: Combines the latest values from multiple Observables
    merge: Combines multiple Observables into one
    forkJoin: Waits for all Observables to complete and then emits their last values as an array
  */
    const obs1 = of(1, 2, 3);
    const obs2 = of('A', 'B', 'C');
    combineLatest([obs1, obs2]).subscribe(([num, letter]) => {
      console.log(`Number: ${num}, Letter: ${letter}`);
    });
  }
  // 5. Angular with RxJS
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http
      .get('https://api.example.com/data')
      .pipe(map((response: any) => response['data']));
  }

  /*
  Here’s a summary of some of the key tools that can power up Angular development

  NgRx for state management.
  Angular CLI for project scaffolding and automation.
  Angular Material and ngx-bootstrap for UI components.
  Apollo Angular for GraphQL integration.
  ngrx-data for simplified entity state management.
  Jest for faster unit testing, and Protractor for end-to-end testing.
  */
}
