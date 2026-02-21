import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  host: {
    class: 'block min-w-[100vw] w-fit min-h-[100vh] overflow-x-auto'
  }
})
export class App {
  protected readonly title = signal('fintech-store');
}
