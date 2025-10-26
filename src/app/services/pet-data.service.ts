import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { shareReplay, map, tap } from 'rxjs/operators';
import { API_ENTRIES_URL } from '../app.component';

export interface PetEntry {
  ID: string;
  'Pet Name': string;
  'Pet Type': string;
  'Pet Breed': string;
  'Pet Color': string;
  'Owner Full Name': string;
  'Phone Number': string;
  'Email': string;
  'Development': string;
  'Unit': string;
  'Photo': string;
}

@Injectable({ providedIn: 'root' })
export class PetDataService {
  private cache$: Observable<PetEntry[]> | null = null;
  private lastFetchTime: number | null = null;
  // Cache configs (24 hour TTL)
  private readonly CACHE_KEY = 'pet_cache_data';
  private readonly CACHE_TIME_KEY = 'pet_cache_time';
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000;

  constructor(private http: HttpClient) {}

  /** Fetch all entries with cache */
  getEntries(forceRefresh = false): Observable<PetEntry[]> {
    const now = Date.now();
    // Try to load from localStorage
    const cachedData = localStorage.getItem(this.CACHE_KEY);
    const cachedTime = localStorage.getItem(this.CACHE_TIME_KEY);

    // Check if local cache exists and is valid
    const isCacheValid =
      cachedData && cachedTime && now - parseInt(cachedTime, 10) < this.CACHE_TTL;

    if (!forceRefresh && isCacheValid) {
      // ✅ Return cached data from localStorage
      const data = JSON.parse(cachedData) as PetEntry[];
      return of(data);
    }

    // 🚀 Fetch from API and update cache
    this.cache$ = this.http.get<PetEntry[]>(API_ENTRIES_URL).pipe(
      tap(data => {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(this.CACHE_TIME_KEY, now.toString());
        this.lastFetchTime = now;
      }),
      shareReplay(1)
    );

    return this.cache$;
  }

  /** Get a single entry by ID (fetches if needed*/
  getEntryById(id: string): Observable<PetEntry | undefined> {
    return this.getEntries().pipe(
        map(entries => entries.find(e => String(e.ID) === String(id)))
      );
  }

  /** Optional: clear cache and local storage manually */
  clearCache(): void {
    this.cache$ = null;
    this.lastFetchTime = null;
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.CACHE_TIME_KEY);
  }
}
