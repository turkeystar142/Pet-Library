import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ADMIN_PASS } from '../app.component';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { PetDataService } from '../services/pet-data.service';

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
    styleUrls: ['./pet-page.component.scss'],
    standalone: false
})
export class PetPageComponent {
  @ViewChild('tooltip') tooltip!: MatTooltip;
  petId: string = '';
  private dataSubject = new BehaviorSubject<Pet | null>(null);
  pet = new Observable<Pet | null>;
  subscription = new Subscription;
  columns: number = 2;

constructor(private activeRoute: ActivatedRoute, private router: Router, private petDataService: PetDataService) { 
  this.columns = this.getNumberOfColumns();
}

@HostListener('window:resize', ['$event'])
onResize(event: Event) {
  this.columns = this.getNumberOfColumns();
}

  ngOnInit() {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.petId = id ? id : '';

    this.petDataService.getEntryById(this.petId).subscribe(response => {
      if (!response) {
        console.warn('No pet found for ID:', this.petId);
        return;
      }
        const data: Pet = {
          name: response['Pet Name'] || 'N/A',
          pet_type: response['Pet Type'] || 'N/A',
          breed: response['Pet Breed'] || 'N/A',
          pet_color: response['Pet Color'] || 'N/A',
          owner_name: response['Owner Full Name'] || 'N/A',
          id: response['ID'] || '0',
          location: (response['Development'] || '') + ' ' + (response?.['Unit'] || ''),
          pet_photo: response['Photo'] || '',
          email: response['Email'] || 'N/A',
          phone: response['Phone Number'] || 'N/A',
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
    // Perform the DELETE request via pet-data service
  }

  checkResult(result: string) {
    if (result.includes('success')) {
      alert('Successfully deleted!');
      console.log(result);
    }
  }
}
