import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

// import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-physician-messaging-checklist',
  templateUrl: './physician-messaging-checklist.component.html',
  styleUrls: ['./physician-messaging-checklist.component.scss'],
})
export class PhysicianMessagingChecklistComponent implements OnInit {
  physicianName: string = '<test physician>';
  patientName: string = '<test patient>';
  checkList;

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

  constructor(private formBuilder: FormBuilder) {
    this.checkList = this.formBuilder.group({
      item1: false,
      item2: false,
      item3: false,
      item4: false,
    });
  }

  onSubmit() {
    console.warn('formSubmitted');
  }

  ngOnInit(): void {}
}
