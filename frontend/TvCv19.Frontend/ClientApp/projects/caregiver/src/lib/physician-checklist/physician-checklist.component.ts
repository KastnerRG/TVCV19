import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhysicianChecklistModel } from './physician-checklist-model';
import { ToolbarService } from 'src/app/toolbar.service';
import { ChatService } from '../chat.service';
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
  show: boolean = true;

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
    toolbar.menuClick.subscribe((e) => {
      this.show = !e.isOpen;
    });
    route.parent.params.subscribe((p: any) => {
      this.patientId = p['id'];
    });

    route.parent.parent.params.subscribe((p) => {
      this.physicianId = p['id'];
    });

    this.patientService
      .getPatient(this.patientId)
      .toPromise()
      .then((res) => {
        this.patientName = res.name;
        this.toolbar.setToolbarData({
          title: this.patientName,
        });
      });

    this.physicianService.getPhysician(this.physicianId).subscribe((p) => {
      this.physicianName = p.name;
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
        false,
        false
      );
    }
  }

  ngOnInit(): void {
    this.uncheckedWarnText = false;
    this.toolbar.setToolbarData({
      title: this.physicianName + ' (' + this.patientName + ')',
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
