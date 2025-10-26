import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ServiceWorkerModule } from '@angular/service-worker';

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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { DashComponent } from './dash/dash.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { PetPageComponent } from './pet-page/pet-page.component'; 
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

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
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        LazyLoadImageModule,
        RouterModule.forRoot(routes, { useHash: false }),
        // Material Components
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatInputModule,
        MatTooltip,
        // Service Worker for Cache
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: true,
          // Register the ServiceWorker as soon as the application is stable
          // or after 10 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:10000'
        })], 
        providers: [
          provideHttpClient(withInterceptorsFromDi()),
        ], })
export class AppModule { }
