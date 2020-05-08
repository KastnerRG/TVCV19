import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  toolBarData = new BehaviorSubject<ToolBarData>({
    title: '',
    menu: undefined,
    back: false,
  });
  constructor() {}

  setToolbarData(data: ToolBarData): void {
    this.toolBarData.next(data);
  }
}

export interface ToolBarData {
  title: string;
  menu: Array<MenuLinks>;
  back: boolean;
}
export interface MenuLinks {
  link: string;
  title: string;
}
