import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FirebaseActivitiesService } from '../../../services/firebase-activities/firebase-activities.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent {

    constructor(
        private svAuth: AuthService,
        private svActivities: FirebaseActivitiesService,
    ) { }

    activities: any[] = [];
    emailPicture: string = '';

    ngOnInit() {
        this.svAuth.getUserId().subscribe(userId => {
            if (userId) {
                this.svActivities.getActivities(userId).subscribe((data: any) => {
                    const activities = data.payload.data()?.activities || [];
                    activities.sort((a: any, b: any) => b.createdAt.toMillis() - a.createdAt.toMillis());
                    this.activities = activities;
                });

            }
        });
        this.svAuth.getUserEmail().subscribe((data: any) => {
            this.svAuth.getUserPictureByEmail(data).then((picture: any) => {
                this.emailPicture = picture;
            });
        });
    }
}
