import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { PhysicianMessagingChecklistModel } from '../physician-messaging-checklist-model';
import { PhysicianMessagingChecklistService } from '../physician-messaging-checklist.service';

// import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-physician-messaging-checklist',
  templateUrl: './physician-messaging-checklist.component.html',
  styleUrls: ['./physician-messaging-checklist.component.scss'],
})
export class PhysicianMessagingChecklistComponent implements OnInit {
  physicianName: string = '<test physician>';
  patientName: string = '<test patient>';
  checkListForm;

  //checkList: Array<PhysicianMessagingChecklistModel> = [];
  checkList: Array<PhysicianMessagingChecklistModel> = [
    {
      id: '1',
      name: 'item1',
      checked: false,
      deleted: false,
    },
    {
      id: '2',
      name: 'item2',
      checked: false,
      deleted: false,
    },
    {
      id: '3',
      name: 'item3',
      checked: false,
      deleted: false,
    },
    {
      id: '4',
      name: 'item4',
      checked: false,
      deleted: false,
    },
  ];

  /*
  user = {
    checkList: [
      { name: 'Checklist Item 1', selected: false, id: 1 },
      { name: 'Checklist Item 2', selected: false, id: 2 },
      { name: 'Checklist Item 3', selected: false, id: 3 },
    ],
  };
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      checkList: this.buildCheckList(),
    });
  }

  get checkList() {
    return this.form.get('checkList') as FormArray;
  }

  buildCheckList() {
    const arr = this.user.checkList.map((item) => {
      return this.fb.control(item.selected);
    });
    return this.fb.array(arr);
  }*/

  constructor(
    private service: PhysicianMessagingChecklistService,
    private router: Router
  ) {
    //service.getPhysicianMessagingChecklist().subscribe((checkList) => (this.checkList = checkList));
  }
  // remove: EventEmitter<mat-form-field> = new EventEmitter();
  closeButtonClick() {
    console.log('Button Clicks');
  }

  itemRemoveClick(item: PhysicianMessagingChecklistModel) {
    item.deleted = true;
  }

  onSubmit() {
    console.warn(this.checkListForm.value);
  }

  ngOnInit(): void {}
}
