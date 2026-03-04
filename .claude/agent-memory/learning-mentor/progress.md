# NgRx Signal Store -- Learning Progress

## Project
Kanban board app (`fintech-store`) -- used as the practice vehicle for NgRx Signal Store.

---

## Curriculum

| # | Concept | Board Feature | Status |
|---|---------|---------------|--------|
| 1 | `withState` + `withMethods` | Core board: lists, cards, CRUD | Done |
| 2 | `withComputed` | `listsVm`, filtered cards, selected card | Done |
| 3 | `withHooks` | Persist board to localStorage | In Progress |
| 4 | `rxMethod` | Debounced search, simulated API calls | Pending |
| 5 | `withLinkedState` | Writable state that resets when a source signal changes | Pending |
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

## Milestone 3 -- withHooks -- In Progress
- Key concepts: withHooks, onInit lifecycle, Angular effect(), localStorage persistence, patchState hydration
- Spec summary: Persist board state (lists, cards, filterQuery) to localStorage using withHooks onInit + effect(). Hydrate on store init, save reactively on change.
- Tasks: 11 tasks covering cleanup, helpers, withHooks integration, and 3 tests
- Stretch goals: resetBoard method, schema versioning, debounced save with untracked()

---

## Notes
- Developer identified the full curriculum themselves -- good self-direction
- Store uses Angular 21.1, NgRx Signals 21.0.1, Vitest, PrimeNG, Tailwind 4
- Testing pattern: TestBed.inject(BoardStore) + patchState(unprotected(store), ...) for setup
- Stale console.log statements exist in board.store.ts and board-page.ts -- cleanup assigned as task 1
- withHooks is prerequisite for Milestone 7 (custom store features / withPersistence)
