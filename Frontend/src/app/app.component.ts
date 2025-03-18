import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElectionComponent } from './components/admin/admin_dashboard/elections/elections.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'OVS_frontend';
}
