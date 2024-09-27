import { Component, HostListener, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_KEY, BASE_URL_SUBMISSION, COMPILED_URL } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

interface Pet {
  name: string;
  name2: string;
  owner_name: string;
  pet_type: string;
  pet_type2: string;
  breed: string;
  breed2: string;
  pet_color: string;
  pet_color2: string;
  location: string;
  phone: string;
  email: string;
  pet_photo: string;
  pet_photo2: string;
  pet_photo3: string;
  id: string;
}

@Component({
  selector: 'app-pet-page',
  templateUrl: './pet-page.component.html',
  styleUrls: ['./pet-page.component.scss']
})
export class PetPageComponent {
  petId: string = '';
  private http = inject(HttpClient);
  private breakpointObserver = inject(BreakpointObserver);
  private dataSubject = new BehaviorSubject<Pet | null>(null);
  pet = new Observable<Pet | null>;
  subscription = new Subscription;
    // Define the property at the class level
    COMPILED_URL_SUBMISSION!: string;
    DELETE_URL_SUBMISSION!: string;
  columns: number = 2;

constructor(private activeRoute: ActivatedRoute, private router: Router) { 
  this.columns = this.getNumberOfColumns();
}

@HostListener('window:resize', ['$event'])
onResize(event: Event) {
  this.columns = this.getNumberOfColumns();
}

  ngOnInit() {

    // this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
    //   this.columns = result.matches ? 1 : 2;
    // });
    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.petId = id ? id : '';
    const SUBMISSION_ID = this.petId;
    // Set the Submission URL for API call
    this.COMPILED_URL_SUBMISSION = BASE_URL_SUBMISSION.concat('/', SUBMISSION_ID, '?apiKey=', API_KEY);;

    this.http.get<{content: any}>(this.COMPILED_URL_SUBMISSION).subscribe(response => {
      const item = response.content;
        const data: Pet = {
          name: item?.answers?.['23']?.answer ? item?.answers?.['23']?.answer : "N/A", // '23' is the key for the 'Pet Name 1' question
          name2: item?.answers?.['24']?.answer ? item?.answers?.['24']?.answer : "N/A", // '24' is the key for the 'Pet Name 2' question
          pet_type: item?.answers?.['7']?.answer ? item?.answers?.['7']?.answer : "N/A", // '7' is the key for the 'Pet Type' question
          pet_type2: item?.answers?.['13']?.answer ? item?.answers?.['13']?.answer : "N/A", // '13' is the key for the 'Pet Type 2' question
          breed: item?.answers?.['9']?.answer ? item?.answers?.['9']?.answer : "N/A", // '9' is the key for the 'Breed' question
          breed2: item?.answers?.['14']?.answer ? item?.answers?.['14']?.answer : "N/A", // '14' is the key for the 'Breed2' question
          pet_color: item?.answers?.['20']?.answer ? item?.answers?.['20']?.answer : "N/A", // '20' is the key for the 'Pet Color' question
          pet_color2: item?.answers?.['21']?.answer ? item?.answers?.['21']?.answer : "N/A", // '21' is the key for the 'Pet Color2' question
          owner_name: item?.answers?.['4']?.prettyFormat ? item?.answers?.['4']?.prettyFormat : "N/A", // '4' is the key for the 'Owner\'s Name' question
          id: item?.id ? item?.id : "0", // 
          location: item?.answers?.['3']?.prettyFormat ? item?.answers?.['3']?.prettyFormat : "N/A", // '3' is the key for the 'Location' question
          pet_photo: item?.answers?.['19']?.answer[0], // '19' is the key for the 'photo' question
          pet_photo2: item?.answers?.['19']?.answer[1], // '19.2' is the key for the 'photo2' question
          pet_photo3: item?.answers?.['19']?.answer[2], // '19.2' is the key for the 'photo' question
          email: item?.answers?.['5']?.answer ? item?.answers?.['5']?.answer : "N/A", // '5' is the key for the 'Email' question
          phone: item?.answers?.['6']?.prettyFormat ? item?.answers?.['6']?.prettyFormat : "N/A", // '6' is the key for the 'Phone' question
        };
        this.dataSubject.next(data);
      });
      
      this.pet = this.dataSubject.asObservable();
  }

  getNumberOfColumns(): number {
    if (window.innerWidth < 1250) {
      return 1;
    }
    else  {
      return 2;
    }
  }

  goBack() {
    // Use the router to navigate back to the previous page
    this.router.navigate(['/dashboard']);
  }

  deletePet(id: string) {
    // Set the Submission URL for DELTE API call
    var result = '';
    this.DELETE_URL_SUBMISSION = BASE_URL_SUBMISSION.concat('/', id, '?apiKey=', API_KEY);
    this.http.delete(this.DELETE_URL_SUBMISSION).subscribe(response => result);
    console.log(result);
  }
}
