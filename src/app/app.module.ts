import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Importing Angular Material Components
import {MatToolbarModule} from '@angular/material/toolbar';
import { NavigationComponent } from './navigation/navigation.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { TableComponent } from './table/table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DashComponent } from './dash/dash.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { PetPageComponent } from './pet-page/pet-page.component'; 
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// Routing Definitions
const routes: Routes = [
  { path: 'dash', component: DashComponent },
  { path: 'table', component: TableComponent },
  { path: 'pet/:id', component: PetPageComponent },
  { path: '', redirectTo: '/dash', pathMatch: 'full' }, // redirect empty path to '/dash'
  { path: '**', redirectTo: '/dash' }, // wildcard route back home
  // more routes here
];

@NgModule({ declarations: [
        AppComponent,
        NavigationComponent,
        TableComponent,
        DashComponent,
        PetPageComponent
    ],
    exports: [RouterModule],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(routes),
        // Material Components
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatInputModule], 
        providers: [
          provideHttpClient(withInterceptorsFromDi()),
          { provide: LocationStrategy, useClass: HashLocationStrategy }
        ], })
export class AppModule { }
