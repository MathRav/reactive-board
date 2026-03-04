# Learning Mentor -- Memory

## Project Overview
- Kanban board app practicing NgRx Signal Store
- Angular 21.1 / NgRx Signals 21.0.1 / Vitest / PrimeNG / Tailwind 4
- Progress tracked in `progress.md` (same directory)

## Architecture
- Store: `src/app/features/board/store/board.store.ts` -- single signalStore with withState, withComputed, withMethods
- State shape: `BoardState { lists: List[], cards: Record<Id, Card>, boardId, selectedCardId, filterQuery }`
- Cards stored in a flat Record, lists hold cardIds arrays
- Tests use `TestBed.inject(BoardStore)` + `patchState(unprotected(store), ...)` pattern
- Vitest with `vi.useFakeTimers()` for time-dependent tests

## Developer Patterns
- Self-directed: identified full 9-concept curriculum independently
- Comfortable with: signals, computed, patchState, referential equality patterns
- Currently learning: withHooks (Milestone 3)

## Curriculum Order
1. withState+withMethods (done) -> 2. withComputed (done) -> 3. withHooks (active) -> 4. rxMethod -> 5. withLinkedState -> 6. state tracking -> 7. custom features -> 8. entities -> 9. events
