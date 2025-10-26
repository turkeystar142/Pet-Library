import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_KEY, BASE_URL_SUBMISSION, ADMIN_PASS, API_ENTRIES_URL} from '../app.component';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';

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
    styleUrls: ['./pet-page.component.scss'],
    standalone: false
})
export class PetPageComponent {
  @ViewChild('tooltip') tooltip!: MatTooltip;
  petId: string = '';
  private http = inject(HttpClient);
  private breakpointObserver = inject(BreakpointObserver);
  private dataSubject = new BehaviorSubject<Pet | null>(null);
  pet = new Observable<Pet | null>;
  subscription = new Subscription;
    // Define the property at the class level
    COMPILED_URL_ENTRY!: string;
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
    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.petId = id ? id : '';
    // const SUBMISSION_ID = this.petId;
    // Set the Submission URL for API call
    this.COMPILED_URL_ENTRY = API_ENTRIES_URL.concat('/', this.petId);;

    this.http.get<any>(API_ENTRIES_URL).subscribe(response => {
      const item = response.content;
        const data: Pet = {
          name:  item['Pet Name'] || 'N/A',
          name2: '',
          pet_type: item['Pet Type'] || 'N/A',
          pet_type2: '',
          breed: item['Pet Breed'] || 'N/A',
          breed2: '',
          pet_color: item['Pet Color'] || 'N/A',
          pet_color2: '',
          owner_name: item['Owner Full Name'] || 'N/A',
          id: item['ID'] || '0',
          location: (item['Development'] || '') + ' ' + (item['Unit'] || ''),
          pet_photo: item['Photo'] || '',
          pet_photo2: '',
          pet_photo3: '',
          email: item['Email'] || 'N/A',
          phone: item['Phone Number'] || 'N/A',
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

  verifyAdmin(id: string) {
    const password = window.prompt('Please enter your password to delete this pet:');
    if (password && password === ADMIN_PASS) {
      // Now post the delete API call with the password verified
      this.deletePet(id);
    } else if (password && (password !== ADMIN_PASS)) {
      alert("Incorrect password");
      console.log('Incorrect password, delete operation canceled');
    }
    else {
      console.log('Delete operation canceled');
    }
  }

  deletePet(id: string) {
    // Set the Submission URL for DELTE API call
    var result = '';
    this.DELETE_URL_SUBMISSION = BASE_URL_SUBMISSION.concat('/', id, '?apiKey=', API_KEY);

    // Perform the DELETE request
    this.http.delete(this.DELETE_URL_SUBMISSION).subscribe(
      (response: any) => {
        // Assuming response contains some result, assign it here
        const result = response.message && response.message.includes('success') ? 'success' : 'error';  // Modify based on your actual API response structure

        // Check the result and show the tooltip if needed
        this.checkResult(result);

        // Navigate to dashboard after processing
        this.router.navigate(['/dash']);
      },
      (error: any) => {
        // Handle error if needed
        console.error('Error during delete:', error);
      }
    );
  }

  checkResult(result: string) {
    if (result.includes('success')) {
      alert('Successfully deleted!');
      console.log(result);
    }
  }
}
