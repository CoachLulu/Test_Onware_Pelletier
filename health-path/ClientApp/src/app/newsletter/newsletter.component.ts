import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { NewsletterService } from '../newsletter.service';

const ALREADY_SUBSCRIBED = "alreadySubscribed";

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);

  emails:string[] = [];

  constructor(private newsletterService: NewsletterService) { }

  ngOnInit(): void {
  }

  getErrorMessage() {
    if (this.email.errors?.['required']) {
      return "Email is required";
    } else if (this.email.errors?.['email']) {
      return "Email is in incorrect format";
    } else if (this.email.errors?.[ALREADY_SUBSCRIBED]) {
      return "Email has already been subscribed to the newsletter";
    } else {
      return "";
    }
  }

  subscribe() {
    if (this.email.valid) {
      const email = this.sanitizeEmail(this.email.value!);

      if (email) {
        this.newsletterService.subscribe(email)
          .subscribe({
            next: success => 
            {
              if (!success) {
                this.email.setErrors({[ALREADY_SUBSCRIBED]: true});
              }
              else
              {
                this.emails.push(email);//little tracker to see if duplicates are possible. 
              }
            }
          });
      }
    }
  }

  //my code here - Mathieu
   sanitizeEmail(s: string): string {
    const parts = s.split('@');
    
    if (parts.length !== 2) {
      // Invalid email format
      return s;
    }

    const localpart = parts[0];
    const domain = parts[1];

    const modifiedLocalpart = localpart.replace(/\./g, "");

    return modifiedLocalpart + "@" + domain;
  }
}
