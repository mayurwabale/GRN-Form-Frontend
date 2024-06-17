import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasicDetailsComponent } from './basic-details/basic-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,BasicDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'grn-form';
}
