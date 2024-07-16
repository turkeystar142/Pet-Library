import { Component, HostListener, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_KEY, BASE_URL_SUBMISSION, COMPILED_URL } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

interface Pet {
  name: string;
  owner_name: string;
  pet_type: string;
  breed: string;
  pet_color: string;
  location: string;
  phone: string;
  email: string;
  pet_photo: string;
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
  columns: number = 2;
  
  placeholderImage = 'src/assets/image-404.png';

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
          name: item.answers['23'].answer, // '7' is the key for the 'Pet Name 1' question
          pet_type: item.answers['7'].answer, // '8' is the key for the 'Pet Type' question
          breed: item.answers['9'].answer, // '5' is the key for the 'Breed' question
          pet_color: item.answers['20'].answer, // '6' is the key for the 'Pet Color' question
          owner_name: item.answers['4'].prettyFormat, // '16' is the key for the 'Owner\'s Name' question
          id: item.id, // Convert the id to a number using the unary plus operator
          location: item.answers['3'].prettyFormat, // '19' is the key for the 'Location' question
          pet_photo: item.answers['19'].answer[0] ? item.answers['19'].answer[0]: this.placeholderImage, // '28' is the key for the 'photo' question
          email: item.answers['5'].answer, // '22' is the key for the 'Email' question
          phone: item.answers['6'].prettyFormat, // '21' is the key for the 'Phone' question
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
}
