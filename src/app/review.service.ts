import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { AppService } from './app.service';

@Injectable()
export class ReviewService {

  constructor(private appService: AppService) {}

  // Observable string sources
  private missionAnnouncedSource = new Subject<string>();
  private missionConfirmedSource = new Subject<string>();

  private reviewStatsSource = new Subject<any>();
  private relevantReviewsSource = new Subject<any>();
  private thinkingSource = new Subject<boolean>();
  private resetReviewSource = new Subject<any>();
  private relevantReviewsSelectionSource = new Subject<string>();

  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  missionConfirmed$ = this.missionConfirmedSource.asObservable();

  reviewStats$ = this.reviewStatsSource.asObservable();
  relevantReviews$ = this.relevantReviewsSource.asObservable();
  thinking$ = this.thinkingSource.asObservable();
  resetReviews$ = this.resetReviewSource.asObservable();
  relevantReviewsSelection$ = this.relevantReviewsSelectionSource.asObservable();

  // Service message commands
  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }

  confirmMission(astronaut: string) {
    this.missionConfirmedSource.next(astronaut);
  }

  thinkingIs(bool) {
    this.thinkingSource.next(bool);
  }

  doApplicationThings(application, region, context) {
    var appHash = {
      appId: application.id,
      region: region,
      context: context
    }

    this.thinkingIs(true);

    this.reviewStatsSource.next(appHash);
    this.relevantReviewsSource.next(appHash);
  }

  resetRelevantReviews() {
    this.resetReviewSource.next();
  }

  selectRelevantReviews(keyword) {
    this.relevantReviewsSelectionSource.next(keyword);
  }

}
