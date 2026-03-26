# Learning Mentor -- Memory

## Project Overview
- Kanban board app practicing NgRx Signal Store
- Angular 21.1 / NgRx Signals 21.0.1 / Vitest / PrimeNG / Tailwind 4
- Progress tracked in `progress.md` (same directory)

## Architecture
- Store: `src/app/features/board/store/board.store.ts` -- single signalStore with withState, withPersistence, withNotifications, withComputed, withMethods, withHooks
- State shape: `BoardState { lists: List[], cards: Record<Id, Card>, boardId, selectedCardId, filterQuery, loading, history, future }`
- Cards stored in a flat Record, lists hold cardIds arrays
- History types: `src/app/features/board/store/board-history.types.ts` -- MoveRecord { cardId, fromListId, fromIndex, toListId, toIndex }, MoveHistory { history, future }
- Tests use `TestBed.inject(BoardStore)` + `patchState(unprotected(store), ...)` pattern
- Vitest via `@angular/build:unit-test` (not standalone vitest CLI -- path aliases break with npx vitest)
- `vi.useFakeTimers()` for time-dependent tests
- LocalStorageService at `src/core/local-storage/local-storage.service.ts` (providedIn: root, uses LOCAL_STORAGE injection token)
- LOCAL_STORAGE token at `src/core/local-storage/local-storage.token.ts` -- injects Storage for testability
- NotificationService at `src/core/errors/notification.service.ts` -- wraps PrimeNG MessageService + ErrorHandler
- withPersistence custom feature at `src/core/local-storage/state/with-persistence.ts`
- withNotifications custom feature at `src/core/errors/with-notifications.ts`
- localStorage key registry at `src/app/features/board/store/board.local-state.utils.ts` -- kept intentionally as centralized key store
- BoardToolbar (presentational) at `src/app/features/board/ui/board-toolbar.ts`

## Developer Patterns
- Self-directed: identified full 9-concept curriculum independently
- Comfortable with: signals, computed, patchState, referential equality patterns, withHooks mechanics, effect() lifecycle, linkedSignal vs computed vs effect, signalStoreFeature with Input constraint
- Responds well to review feedback: applied all fixes from review 1 (error handling, console.log cleanup)
- Tests are explicitly not a priority for this developer right now
- Known debt: double ErrorHandler call in store, LocalStorageService.get not hardened (JSON.parse can throw), version leaks in getPersistedState envelope, board.local-state.utils.ts still exists
- Recurring pattern: tends to use `as unknown as` casts to work around type mismatches instead of restructuring the types
- Recurring pattern: tends to split state updates across multiple patchState calls instead of single atomic updates
- Dismissed double-patchState concern in M6 (believes Angular batches synchronously)

## Curriculum Order
1. withState+withMethods (done) -> 2. withComputed (done) -> 3. withHooks (done) -> 4. rxMethod (done) -> 5. linkedSignal (done) -> 6. state tracking (done) -> 7. custom features (reviewed, fixes needed) -> 8. entities -> 9. events

## Test Runner Note
- Use `npx ng test --no-watch` (NOT `npx vitest run`) -- the Angular CLI test builder resolves @core/* path aliases correctly

## Milestone 7 complete. Ready for Milestone 8 (Entity management).
