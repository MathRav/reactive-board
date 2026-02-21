import {AfterViewInit, Directive, ElementRef, OnDestroy, inject, signal} from '@angular/core';

@Directive({
  selector: '[inView]',
  exportAs: 'inView'
})
export class InViewDirective implements AfterViewInit, OnDestroy {
  readonly isInView = signal(true);

  readonly #el = inject(ElementRef);
  #observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.#observer = new IntersectionObserver(
      ([entry]) => this.isInView.set(entry.isIntersecting),
      {threshold: 0.5}
    );
    this.#observer.observe(this.#el.nativeElement);
  }

  ngOnDestroy(): void {
    this.#observer?.disconnect();
  }
}
