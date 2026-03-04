# Learning Mentor -- Memory

## Project Overview
- Kanban board app practicing NgRx Signal Store
- Angular 21.1 / NgRx Signals 21.0.1 / Vitest / PrimeNG / Tailwind 4
- Progress tracked in `progress.md` (same directory)

## Architecture
- Store: `src/app/features/board/store/board.store.ts` -- single signalStore with withState, withComputed, withMethods, withHooks, withProps
- State shape: `BoardState { lists: List[], cards: Record<Id, Card>, boardId, selectedCardId, filterQuery }`
- Cards stored in a flat Record, lists hold cardIds arrays
- Tests use `TestBed.inject(BoardStore)` + `patchState(unprotected(store), ...)` pattern
- Vitest via `@angular/build:unit-test` (not standalone vitest CLI -- path aliases break with npx vitest)
- `vi.useFakeTimers()` for time-dependent tests
- LocalStorageService at `src/core/local-storage/local-storage.service.ts` (providedIn: root)
- NotificationService at `src/core/errors/notification.service.ts` -- wraps PrimeNG MessageService + ErrorHandler
- Persistence types at `src/app/features/board/store/board.local-state.utils.ts`

## Developer Patterns
- Self-directed: identified full 9-concept curriculum independently
- Comfortable with: signals, computed, patchState, referential equality patterns, withHooks mechanics, effect() lifecycle
- Responds well to review feedback: applied all fixes from review 1 (error handling, console.log cleanup)
- Tests are explicitly not a priority for this developer right now
- Known debt: double ErrorHandler call in store (NotificationService already calls it), no schema versioning on localStorage

## Curriculum Order
1. withState+withMethods (done) -> 2. withComputed (done) -> 3. withHooks (done) -> 4. rxMethod -> 5. withLinkedState -> 6. state tracking -> 7. custom features -> 8. entities -> 9. events

## Test Runner Note
- Use `npx ng test --no-watch` (NOT `npx vitest run`) -- the Angular CLI test builder resolves @core/* path aliases correctly

## Deferred Items for Milestone 7 (withPersistence custom feature)
- LocalStorageService should handle JSON.parse errors internally (return null, not throw)
- Schema versioning: wrap persisted data in `{ version, data }` envelope
- Address redundant effect() write on init in the generic implementation
