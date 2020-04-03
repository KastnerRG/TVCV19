import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  patientName = '<Patient Name>';
  chatMessages = [{ message: 'message1' }, { message: 'message2' }];

  constructor() { }

  ngOnInit(): void {
  }

}
