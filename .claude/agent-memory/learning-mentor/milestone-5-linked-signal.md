# 🎯 Milestone 5 — linkedSignal

## Context

You already used `linkedSignal` once in `BoardCardSearch` to sync the input field with a parent-provided value. Milestone 5 applies it to a more consequential problem: the card edit form.

`BoardCardFormModal` currently uses an `effect()` in the constructor to watch the `card` input and reset the form model when it changes:

```ts
constructor() {
  effect(() => {
    const card = this.card();
    this.cardFormModel.set(card ? cardToFormModel(card) : emptyFormModel());
  });
}
```

This is a known anti-pattern. `effect()` is for side effects — talking to the DOM, calling services, logging. Using it to derive and set local signal state is semantically wrong, runs after render, and makes data flow harder to trace. The correct tool is `linkedSignal`: a writable signal whose value is reset by a computation whenever its reactive dependencies change.

The edit flow is also currently incomplete — you can create cards but not edit them. This milestone finishes it.

## Learning Objectives

- Understand when `linkedSignal` is correct vs `computed` vs `effect`
- Replace an `effect()`-driven state sync with `linkedSignal`
- Wire up a full select → edit → save → deselect card flow through the store
- Understand the reset semantics: `linkedSignal` resets to the computed value when dependencies change, but can be freely mutated between resets

## Feature Spec

### What to build

**Complete the card edit flow:**
- Clicking a card calls `store.selectCard(id)` — the store already has this method and `selectedCard` computed
- The board page opens the edit modal when `selectedCard()` is non-null
- The edit modal receives `selectedCard` as its `card` input
- Saving calls `store.updateCard(id, data)` and deselects
- Closing deselects without saving

**Replace `effect()` with `linkedSignal` in the form modal:**
- `cardFormModel` becomes a `linkedSignal` that derives its value from the `card` input signal
- Mutating the form (typing in fields) still works — the signal is writable between resets
- Switching to a different card resets the form to the new card's data automatically

### Where to build it

- `board-card-form-modal.ts` — replace `effect()` + `cardFormModel.set()` with `linkedSignal`
- `board-card.ts/html` — add a click/edit trigger that calls `store.selectCard(id)` (or emits an output)
- `board-list.ts/html` — wire up the edit modal alongside the existing create modal
- `board-page.ts/html` — manage edit modal visibility based on `store.selectedCard`

### Technical constraints

- `linkedSignal` accepts a computation function: `linkedSignal(() => card() ? cardToFormModel(card()!) : emptyFormModel())`
- The form fields must still be locally mutable — the user can type without affecting the store
- Only `save()` triggers `store.updateCard()`; `close()` triggers `store.selectCard(null)`
- The `selectedCard` computed already exists in the store — expose it from `BoardPage` and pass it to the modal

### What NOT to do

- Don't keep the `effect()` alongside `linkedSignal` — remove it entirely
- Don't derive form state with `computed()` — it's read-only and can't be locally mutated by the user
- Don't store form state in the board store — it's ephemeral UI state that belongs in the component

## Task List

```
[ ] 1. Add an edit trigger to BoardCard — a button (or clicking the card body) that emits an `edit` output with the card ID
[ ] 2. Wire the edit output up through BoardList to BoardPage — BoardList emits it, BoardPage calls store.selectCard(id)
[ ] 3. In BoardPage, expose selectedCard from the store and use it to control edit modal visibility
[ ] 4. Pass selectedCard() as the card input to BoardCardFormModal in the edit modal
[ ] 5. Replace the effect() in BoardCardFormModal with linkedSignal — cardFormModel = linkedSignal(() => ...)
[ ] 6. Wire the updated output from the form modal to store.updateCard(selectedCard().id, data) then store.selectCard(null)
[ ] 7. Wire the closed output to store.selectCard(null)
[ ] 8. Verify the reset behaviour: select card A (form fills with A's data), close, select card B (form fills with B's data, no stale A data)
```

## Validation Checklist

- [ ] Clicking a card's edit trigger opens the modal with that card's data pre-filled
- [ ] Editing the form fields does not affect the store (changes are local until save)
- [ ] Saving calls `store.updateCard()` and closes the modal — the board reflects the updated card
- [ ] Closing without saving discards edits — reopening the same card shows original data
- [ ] Selecting a different card resets the form — no stale data from the previous card
- [ ] The `effect()` in the constructor is gone — no signal mutation inside effects
- [ ] You can explain: "`linkedSignal` resets when its source changes, but is writable in between — `computed` is read-only, `effect` is for side effects"

## Stretch Goals

- [ ] **Optimistic edit UX:** show edited values in the board immediately while the "save" is processing (pairs with M4's rxMethod pattern if you later make updateCard async)
- [ ] **Dirty state indicator:** add a `hasUnsavedChanges` computed that compares the current form state to the original card — show a badge or indicator in the modal header
