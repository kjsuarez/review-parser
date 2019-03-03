import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable()
export class ReviewService {

  // Observable string sources
  private missionAnnouncedSource = new Subject<string>();
  private missionConfirmedSource = new Subject<string>();

  private reviewStatsSource = new Subject<any>();
  private relevantReviewsSource = new Subject<any>();

  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  missionConfirmed$ = this.missionConfirmedSource.asObservable();

  reviewStats$ = this.reviewStatsSource.asObservable();
  relevantReviews$ = this.relevantReviewsSource.asObservable();

  // Service message commands
  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }

  confirmMission(astronaut: string) {
    this.missionConfirmedSource.next(astronaut);
  }

  doApplicationThings(application, region) {
    // this.currentAppId = application.id
    // this.getReviewStats(application.id, region);
    var appHash = {
      appId: application.id,
      region: region
    }
    this.reviewStatsSource.next(appHash);
    // this.getRelevantReviews(application.id, region);
    this.relevantReviewsSource.next(appHash);
  }
}
