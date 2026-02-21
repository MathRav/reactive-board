import {Component, input} from '@angular/core';

@Component({
  selector: 'board-chip',
  template: `
    {{ label() }}
    <ng-content />
  `,
  host: {
    class: 'inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold rounded border border-slate-100',
  },
})
export class BoardChip {
  readonly label = input.required<string>();
}
