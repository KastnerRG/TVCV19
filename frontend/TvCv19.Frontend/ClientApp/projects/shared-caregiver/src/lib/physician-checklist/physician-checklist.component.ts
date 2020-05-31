import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { PhysicianChecklistModel } from '../physician-checklist-model';
import { ToolbarService } from 'src/app/toolbar.service';
import { ChatService } from '../chat.service';
import { MediaService } from '../media.service';
import { MessageModel } from 'projects/shared/src/public-api';
import {
  PhysicianService,
  PatientService,
} from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-physician-checklist',
  templateUrl: './physician-checklist.component.html',
  styleUrls: ['./physician-checklist.component.scss'],
})
export class PhysicianChecklistComponent implements OnInit {
  patientId: string;
  physicianId: string;
  patientName: string;
  physicianName: string;
  uncheckedWarnText: boolean;
  checkListForm;

  inputItems = [
    'Check Manual resuscitator',
    'Check Suction',
    'Check Other Items',
    'Listen and document breath sounds',
    'Check ETT(endotracheal tube) position',
    'Compare ETT to previous assessment',
    'Check Inline suction catheter',
    'If need: Change Inline suction catheter',
    'Check HME condition ',
    'Change HME if needed',
    'Check connections tight and secure',
    'Check if humidifier chamber filling',
    'Check humidifier H2O source sufficient',
  ];

  checkList: Array<PhysicianChecklistModel> = [];

  constructor(
    private chatService: ChatService,
    private toolbar: ToolbarService,
    private physicianService: PhysicianService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    //get the patientId
    route.parent.params.subscribe((p: any) => {
      this.patientId = p['id'];
    });

    //get the physicianId
    route.parent.parent.params.subscribe((p) => {
      this.physicianId = p['id'];
    });

    //try to grab the patient's name using patient service and set toolbar
    this.patientService
      .getPatient(this.patientId)
      .toPromise()
      .then((res) => {
        this.patientName = res.name;
        this.toolbar.setToolbarData({
          menu: undefined,
          title: this.physicianName + ' (' + this.patientName + ')',
          back: true,
        });
      });

    //try to grab the physician's name using physician service and set toolbar
    this.physicianService.getPhysician(this.physicianId).subscribe((p) => {
      this.physicianName = p.name;
      this.toolbar.setToolbarData({
        menu: undefined,
        title: this.physicianName + ' (' + this.patientName + ')',
        back: true,
      });
    });
  }

  closeButtonClick() {
    console.log('Button Clicks');
  }

  itemRemoveClick(item: PhysicianChecklistModel) {
    item.deleted = true;
  }

  onSubmit() {
    let unchecked = false;
    this.checkList.forEach((p) => {
      if (!p.checked && !p.deleted) {
        unchecked = true;
      }
    });

    //check if there are still items unchecked on the list -> warning message if yes, return to previous page if yes
    if (unchecked) {
      this.uncheckedWarnText = true;
    } else {
      this.router.navigateByUrl(
        '/caregiver/' + this.physicianId + '/patient/' + this.patientId
      );
      this.uncheckedWarnText = false;
      this.chatService.sendMessageAsync(
        this.patientId,
        this.physicianId,
        'Checklist completed by ' + this.physicianName,
        null,
        false,
        false,
        false
      );
    }
  }

  ngOnInit(): void {
    this.uncheckedWarnText = false;
    this.toolbar.setToolbarData({
      menu: undefined,
      title: this.physicianName + ' (' + this.patientName + ')',
      back: true,
    });
    for (let i = 0; i < this.inputItems.length; i++) {
      this.checkList.push({
        id: (i + 1).toString(),
        name: this.inputItems[i],
        checked: false,
        deleted: false,
        scheduleInterval: '',
        innerList: [],
      });
    }
  }
}
