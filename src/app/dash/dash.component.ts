import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { COMPILED_URL } from '../app.component';

interface Card {
  name: string;
  owner_name: string;
  pet_type: string;
  breed: string;
  pet_color: string;
  location: string;
  id: number;
  cols: number;
  rows: number;
}

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private http = inject(HttpClient);
  private dataSubject = new BehaviorSubject<Card[]>([]);
  cards!: Observable<Card[]>;
  

  ngOnInit() {
    this.http.get<{content: any[]}>(COMPILED_URL).subscribe(response => {
      const data = response.content.map(item => {
        return {
          name: item.answers['7'].answer, // '7' is the key for the 'Pet Name 1' question
          pet_type: item.answers['8'].answer, // '8' is the key for the 'Pet Type' question
          breed: item.answers['5'].answer, // '5' is the key for the 'Breed' question
          pet_color: item.answers['6'].answer, // '6' is the key for the 'Pet Color' question
          owner_name: item.answers['16'].prettyFormat, // '16' is the key for the 'Owner\'s Name' question
          id: +item.id, // Convert the id to a number using the unary plus operator
          location: item.answers['19'].prettyFormat, // '19' is the key for the 'Location' question
          cols: 1,
          rows: 1
        };
      });
      this.dataSubject.next(data);
    

    this.cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        if (matches) {
          return this.dataSubject.value.map(card => ({ ...card, cols: 1, rows: 1 }));
        }

        return this.dataSubject.value.map(card => ({ ...card, cols: 1, rows: 1 }));
      })
    );
  });
  }

  /** Based on the screen size, switch from standard to one column per row */
  // cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
  //   map(({ matches }) => {
  //     if (matches) {
  //       return [
  //         { title: 'Card 1', cols: 1, rows: 1 },
  //         { title: 'Card 2', cols: 1, rows: 1 },
  //         { title: 'Card 3', cols: 1, rows: 1 },
  //         { title: 'Card 4', cols: 1, rows: 1 }
  //       ];
  //     }

  //     return [
  //       { title: 'Card 1', cols: 1, rows: 1 },
  //       { title: 'Card 2', cols: 1, rows: 1 },
  //       { title: 'Card 3', cols: 1, rows: 1 },
  //       { title: 'Card 4', cols: 1, rows: 1 }
  //     ];
  //   })
  // );
}
