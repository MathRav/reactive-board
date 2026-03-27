# NgRx Signal Store -- Learning Progress

## Project
Kanban board app (`fintech-store`) -- used as the practice vehicle for NgRx Signal Store.

---

## Curriculum

| # | Concept | Board Feature | Status |
|---|---------|---------------|--------|
| 1 | `withState` + `withMethods` | Core board: lists, cards, CRUD | Done |
| 2 | `withComputed` | `listsVm`, filtered cards, selected card | Done |
| 3 | `withHooks` | Persist board to localStorage | Done |
| 4 | `rxMethod` | Debounced search, simulated API calls | Done |
| 5 | `linkedSignal` | Card edit form resets when selected card changes | Done |
| 6 | State tracking | Undo/redo for card moves | Done |
| 7 | Custom store features | Extract reusable `withPersistence(key)` | Reviewed |
| 8 | Entity management | Migrate `cards: Record<Id, Card>` to `withEntities` | Planned |
| 9 | Events | Emit events when card moves to DONE | Pending |

---

## Milestone 1 -- withState + withMethods -- Done
- Key concepts: signalStore creation, patchState, withState, withMethods
- Spec summary: Core board CRUD -- lists, cards, add/remove/move/update operations
- Review notes: Solid implementation. Good use of referential equality checks in util functions.

## Milestone 2 -- withComputed -- Done
- Key concepts: withComputed, derived state, computed signals, view models
- Spec summary: listsVm computed that joins lists+cards, selectedCard computed, filterQuery filtering
- Review notes: Clean computed separation. Cards stored as Record<Id, Card> with cardIds in lists.

## Milestone 3 -- withHooks -- Done
- Key concepts: withHooks, onInit lifecycle, Angular effect(), localStorage persistence, patchState hydration
- Spec summary: Persist board state (lists, cards, filterQuery) to localStorage using withHooks onInit + effect(). Hydrate on store init, save reactively on change.
- Tasks: 11 tasks covering cleanup, helpers, withHooks integration, and 3 tests
- Stretch goals: resetBoard method, schema versioning, debounced save with untracked()
- Review 1 notes: Missing try/catch on hydration, no tests, stale console.log
- Review 2 notes (final):
  - GOOD: All review 1 fixes applied (error handling added, console.log cleaned). Correct withHooks+effect pattern, clean BoardLocalState type, withProps for DI
  - MINOR: Double ErrorHandler invocation (NotificationService already calls it + store calls it again) -- quick fix recommended before M4
  - DEFERRED TO M7: LocalStorageService parse error contract, schema versioning on hydrated data
  - UNDERSTOOD: effect() redundant write on init -- developer should grasp why before building withPersistence

---

## Milestone 4 -- rxMethod -- In Progress
- Resources: NgRx Signal Store rxMethod docs, @ngrx/operators tapResponse
- Key concepts: rxMethod, RxJS pipelines inside signal store, debounceTime, switchMap, tapResponse, optimistic updates, error revert
- Spec summary: Two features — (A) convert search to debounced type-ahead using rxMethod<string> with debounceTime+distinctUntilChanged, (B) simulated async card archival using rxMethod<Id> with switchMap+timer+tapResponse for optimistic update/revert pattern
- Review notes: --

## Milestone 4 -- rxMethod -- Done
- Key concepts: rxMethod, switchMap as async boundary, tapResponse for safe error handling, loading state
- Spec summary: loadBoard rxMethod with cache-hit (localStorage) vs cache-miss (timer mock) paths, tapResponse for success/error, loading flag in BoardState
- Review notes: Fixed timeout→switchMap+timer, redundant spread, finalize→tapResponse, loading added to BoardState. Clean final implementation.

## Milestone 5 -- linkedSignal -- Done
- Key concepts: linkedSignal, derived writable state, reset semantics, linkedSignal vs computed vs effect
- Spec summary: Replace effect()-driven form sync in BoardCardFormModal with linkedSignal; complete card edit UX (select → open modal → edit → save → deselect)
- Review notes:
  - Clean linkedSignal in form modal, full edit flow, dual-mode component
  - Fixed: state sync (onHide + one-way [visible] binding), decoupled deselection from store, naming, dialog header
  - Developer correctly switched hasSelectedCard from linkedSignal to computed after removing the two-way binding need
  - Mastered: linkedSignal primary use case, knows when computed vs linkedSignal vs effect is appropriate

## Milestone 6 -- State tracking (Undo/Redo) -- Reviewed
- Key concepts: command pattern undo, history/future stacks, bounded history, atomic state transitions
- Spec summary: Undo/redo for card moves using history[] and future[] arrays in BoardState, MoveRecord type, canUndo/canRedo computed, BoardToolbar presentational component
- Review notes:
  - GOOD: Clean MoveRecord type, mutateHistory flag to prevent recursive history in undo/redo, bounded history (20), dumb toolbar component, computed for canUndo/canRedo
  - REQUIRED FIX: Double patchState in undo/redo -- moveCard does one patchState, then undo/redo does another for history/future. Must be consolidated into single atomic patchState.
  - MINOR: cardIndexInList return type says `number | undefined` but findIndex returns -1, not undefined. Type is misleading.
  - DESIGN NOTE: history/future not persisted to localStorage (intentional or accidental -- developer should decide)
  - FRAGILITY: undo/redo reads history/future signals before calling moveCard, then overwrites after. Works only because mutateHistory=false does not touch those fields. Implicit contract.
  - NO TESTS for undo/redo
  - Ready for M7 after atomicity fix
  - Developer dismissed double-patchState concern (Angular batches signal updates synchronously)

## Milestone 7 -- Custom Store Features (withPersistence) -- Done
- Key concepts: signalStoreFeature, custom feature authoring, Input constraint overload, type<T>(), getState(), schema versioning, generic reusable store features
- Spec summary: Extract inline localStorage persistence from withHooks into a generic withPersistence(config) custom feature. Config takes key, select function, version. Versioned envelope in localStorage.
- Actual location: src/core/local-storage/state/with-persistence.ts (dev chose different path than spec)
- Bonus: withNotifications feature at src/core/errors/with-notifications.ts, LOCAL_STORAGE injection token at src/core/local-storage/local-storage.token.ts
- Review notes:
  - GOOD: Correct signalStoreFeature with Input constraint + type<T>(), clean store composition order, withNotifications extraction, LOCAL_STORAGE token for testability, remove() added to LocalStorageService, stale console.log cleaned
  - BUG: getPersistedState returns envelope with version -- version leaks into patchState. Must use { version, data } envelope and strip version on read.
  - BUG: getPersistedState uses unconstrained <R> generic instead of outer T -- provides no type safety
  - STILL MISSING: LocalStorageService.get does not try/catch JSON.parse (deferred since M3)
  - DESIGN: select() receives StateSignals but cast with `as unknown as` -- should use getState() for plain values
  - DESIGN: No auto-hydration in onInit -- hydration delegated to consumer via getPersistedState() method. Feature is utility-shaped rather than self-contained.
  - NOTE: board.local-state.utils.ts kept intentionally as centralized localStorage key registry (developer decision)
  - FIXES APPLIED: envelope { version, data } structure correct, getPersistedState returns data.data on hit, try/catch wraps _localStorage.get
  - OPTIONAL: auto-hydration, remove <R> generic, eliminate as-unknown-as cast

## Milestone 8 -- Entity Management (withEntities) -- Planned
- Resources: @ngrx/signals/entities API (withEntities, addEntity, removeEntity, updateEntity, setAllEntities, EntityMap, EntityState)
- Key concepts: withEntities<Card>(), entity updater functions as PartialStateUpdater, composing entity updaters with plain patches in patchState, EntityMap vs Record, entityMap/ids/entities signals
- Spec summary: Migrate cards from hand-rolled Record<Id, Card> to withEntities<Card>(). No new features -- pure refactor. All 7 card-touching methods rewritten to use entity API. Persistence updated to read entityMap, version bumped to invalidate stale cache.
- Files affected: board-state.types.ts, board.store.ts, board.util.ts, board.mock.constants.ts
- 15 tasks, 3 stretch goals

## Notes
- Developer identified the full curriculum themselves -- good self-direction
- Store uses Angular 21.1, NgRx Signals 21.0.1, Vitest, PrimeNG, Tailwind 4
- Testing pattern: TestBed.inject(BoardStore) + patchState(unprotected(store), ...) for setup
- Stale console.log statements exist in board.store.ts and board-page.ts -- cleanup assigned as task 1
- withHooks is prerequisite for Milestone 7 (custom store features / withPersistence)
