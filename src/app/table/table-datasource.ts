import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TableItem {
  name: string;
  id: number;
}

const FORM_ID = '240437381261048';
const API_KEY = '10aab04ed94653cc1953f5e4f9406395';
const BASE_URL = 'https://api.jotform.com/form';
const COMPILED_URL = BASE_URL.concat('/', FORM_ID, '/submissions?apiKey=', API_KEY);

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableDataSource extends DataSource<TableItem> {
  data = new BehaviorSubject<TableItem[]>([]);
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private http: HttpClient) {
    super();
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
        };
      });
      this.data.next(data);
    });
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TableItem[]> {
    return this.data.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TableItem[]): TableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TableItem[]): TableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }

}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
