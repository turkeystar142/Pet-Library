import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableDataSource, TableItem } from './table-datasource';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: false
})
export class TableComponent implements AfterViewInit {
  private _paginator!: MatPaginator;
  private _sort!: MatSort;

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    if (this.dataSource) { this.dataSource.paginator = paginator; }
  }

  get paginator(): MatPaginator {
    return this._paginator;
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    this._sort = sort;
    if (this.dataSource) { this.dataSource.sort = sort; }
  }

  get sort(): MatSort {
    return this._sort;
  }
  
  @ViewChild(MatTable) table!: MatTable<TableItem>;
  dataSource: TableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = ['name', 'pet_type', 'breed', 'pet_color', 'owner_name', 'location'];

  constructor(private http: HttpClient) {
    this.dataSource = new TableDataSource(this.http);
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }

}
