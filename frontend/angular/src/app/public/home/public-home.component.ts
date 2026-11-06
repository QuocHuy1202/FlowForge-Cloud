import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSwitchComponent } from '../../shared/components/language-switch/language-switch.component';
import { AppLocalizationPipe } from '../../shared/pipes/localization.pipe';

@Component({
    selector: 'app-public-home',
    standalone: true,
    imports: [RouterLink, LanguageSwitchComponent, AppLocalizationPipe],
    templateUrl: './public-home.component.html',
    styleUrl: './public-home.component.scss',
})
export class PublicHomeComponent {}
