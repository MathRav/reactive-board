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
| 5 | `linkedSignal` | Card edit form resets when selected card changes | In Progress |
| 6 | State tracking | Undo/redo for card moves | Pending |
| 7 | Custom store features | Extract reusable `withPersistence(key)` | Pending |
| 8 | Entity management | Migrate `cards: Record<Id, Card>` to `withEntities` | Pending |
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

## Notes
- Developer identified the full curriculum themselves -- good self-direction
- Store uses Angular 21.1, NgRx Signals 21.0.1, Vitest, PrimeNG, Tailwind 4
- Testing pattern: TestBed.inject(BoardStore) + patchState(unprotected(store), ...) for setup
- Stale console.log statements exist in board.store.ts and board-page.ts -- cleanup assigned as task 1
- withHooks is prerequisite for Milestone 7 (custom store features / withPersistence)
