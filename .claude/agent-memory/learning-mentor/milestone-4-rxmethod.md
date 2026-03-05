# 🎯 Milestone 4 — rxMethod

## Context

Your store currently does everything synchronously — `setFilterQuery` instantly writes to state, card operations patch state in-place. That works fine for a local-only app, but real-world stores need to handle **asynchronous, cancellable, debounced** workflows. That's what `rxMethod` is for.

`rxMethod` bridges the signal store with RxJS. It gives you a method on the store that accepts either a static value or an Observable, pipes it through an RxJS pipeline you define, and manages the subscription lifecycle automatically (unsubscribes when the store is destroyed). This is the right tool when you need operators like `debounceTime`, `switchMap`, `distinctUntilChanged`, or `tap` inside the store.

You'll apply this by converting the search flow to a **debounced, type-ahead search** with a loading indicator, and by adding a **simulated async card archival** operation (fake API call with delay).

## Learning Objectives

After this milestone you will be able to:
- Use `rxMethod` to define store methods that run RxJS pipelines
- Pass both static values and Observables to an `rxMethod`
- Combine `rxMethod` with `patchState` inside `tap`/`switchMap` callbacks
- Use `pipe(debounceTime, distinctUntilChanged, ...)` for type-ahead search
- Manage loading/pending state alongside async operations
- Use `tapResponse` from `@ngrx/operators` for safe async side-effect handling

## Feature Spec

### Feature A — Debounced Type-Ahead Search

**What to build:** Convert the search from "click to search" to "type-ahead with debounce". As the user types, the filter should apply after 300ms of inactivity. No search button needed — the input drives the filter directly.

**Where to build it:**
- `board.store.ts` — replace `setFilterQuery` with an `rxMethod`-based `updateFilter`
- `board-card-search.ts` / `board-card-search.html` — emit on every keystroke instead of on button click; remove the search button
- `board-page.ts` — adapt the wiring

**Technical constraints:**
- The `rxMethod` must accept `string` (so it works with both static calls and Observable inputs)
- Pipeline: `debounceTime(300)` → `distinctUntilChanged()` → `tap(query => patchState(...))`
- Add a `searching: boolean` state slice — set to `true` when the user types, `false` when the debounce resolves. This simulates how you'd show a spinner during a real API search.
- The `listsVm` computed must continue to work as-is (it reads `filterQuery`, which `rxMethod` will update)

**What NOT to do:**
- Don't debounce in the component with a `Subject` — the point is to learn `rxMethod` inside the store
- Don't use `effect()` for this — `rxMethod` is the correct tool for RxJS pipelines
- Don't remove the clear/reset button — it should call `updateFilter('')` directly (static value, bypassing debounce via a separate immediate path, or just letting it go through the pipeline)

### Feature B — Simulated Async Card Archival

**What to build:** Add an "archive card" operation that simulates calling a backend API. When the user archives a card, it should:
1. Set the card's status to a new `ARCHIVED` status immediately (optimistic update)
2. Simulate a 1.5s API call (use `timer(1500)` or `delay(1500)`)
3. On "success": remove the card from the board (call existing `removeCard`)
4. On "failure" (simulate ~20% failure rate with `Math.random()`): revert the card to its previous status and show an error notification

**Where to build it:**
- `board-state.types.ts` — add `ARCHIVED` to `StatusEnum`
- `board.store.ts` — add `archiveCard` as an `rxMethod<Id>` with a `switchMap` pipeline
- `board-state.types.ts` — add `archivingCardId: Id | null` to `BoardState` for tracking which card is being archived
- Wire it up from the UI (a button on the card or the card detail modal — your choice on placement)

**Technical constraints:**
- Use `rxMethod<Id>` — the pipeline receives a card ID
- Pipeline: `switchMap` → optimistic `patchState` → `timer(1500)` or `delay` → `tapResponse` for success/error handling
- Use `tapResponse` from `@ngrx/operators` (install if needed) — this is the idiomatic way to handle success/error in NgRx async flows without breaking the Observable chain
- The `archivingCardId` state lets the UI show a spinner/disabled state on the card being archived
- On error, revert the card status to what it was before archiving

**What NOT to do:**
- Don't use `async/await` or Promises — the point is to stay in the RxJS pipeline
- Don't use `firstValueFrom` — stay reactive
- Don't skip the error/revert path — handling failure is the key learning

## Task List

```
[ ] 1. Add `searching: boolean` and `archivingCardId: Id | null` to BoardState and initialState — new state slices for async tracking
[ ] 2. Add `ARCHIVED` to StatusEnum — needed for the archive feature
[ ] 3. Install `@ngrx/operators` if not present (`npm i @ngrx/operators`) — provides tapResponse
[ ] 4. Convert `setFilterQuery` to `updateFilter: rxMethod<string>` — pipeline: debounceTime(300) → distinctUntilChanged() → tap(patchState). Set `searching: true` when input arrives (before debounce), `false` when it resolves.
[ ] 5. Expose a `searching` computed or direct signal in the store — the UI will use this to show a subtle loading indicator
[ ] 6. Update BoardCardSearch to emit on every keystroke — use `(input)` event or reactive form valueChanges instead of button click. Remove the search button. Keep the clear button.
[ ] 7. Update BoardPage to wire the new search flow — the component should pass keystrokes into `store.updateFilter()`
[ ] 8. Implement `archiveCard: rxMethod<Id>` — pipeline: switchMap that does optimistic patchState (set status to ARCHIVED, set archivingCardId), then timer(1500), then tapResponse: on success call removeCard + clear archivingCardId, on error revert status + clear archivingCardId + notify
[ ] 9. Add a UI trigger for archive — an archive button on the card component or the card form modal. Disable it while archivingCardId matches this card's ID.
[ ] 10. Verify the full flow end-to-end — type-ahead filters as you type with 300ms delay, archive shows optimistic update then resolves, archive failure reverts cleanly
```

## Validation Checklist

- [ ] Typing in the search input filters cards after ~300ms pause, without clicking any button
- [ ] Typing "abc" then immediately "abcd" only triggers one filter update (distinctUntilChanged works)
- [ ] The `searching` signal is `true` briefly while debounce is pending, then `false`
- [ ] Clearing search via the clear button resets the filter (passes static `''` to `updateFilter`)
- [ ] Archiving a card immediately shows it as ARCHIVED (optimistic update)
- [ ] During the 1.5s archive delay, the card shows a loading/disabled state
- [ ] On archive success, the card is removed from the board
- [ ] On archive failure (~20% of the time), the card reverts to its previous status and an error notification appears
- [ ] No manual `subscribe()` calls anywhere — `rxMethod` manages all subscriptions
- [ ] The localStorage persistence (from M3) continues to work correctly with the new state slices
- [ ] You can explain: "rxMethod accepts a value OR an Observable, pipes it through RxJS operators, and auto-unsubscribes on destroy"

## Stretch Goals

- [ ] **Cancellable archive:** If the user clicks "archive" then clicks "cancel" within the 1.5s window, cancel the pending operation. This tests your understanding of `switchMap` cancellation — calling `archiveCard` again with a different card ID would cancel the first.
- [ ] **Search highlight:** Add a computed that exposes the active search term so the UI can highlight matching text in card titles.
- [ ] **Retry on failure:** Instead of immediately reverting on archive failure, show a "Retry" option that re-triggers the rxMethod with the same card ID.
