import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppLocalizationPipe } from '../shared/pipes/localization.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppLocalizationPipe]
})
export class HomeComponent { }
