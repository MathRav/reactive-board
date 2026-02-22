import {FieldTree} from '@angular/forms/signals';

/**
 * Recursively marks all fields of a signal form as touched.
 * Works with nested objects and arrays.
 */
export function markAllAsTouched<T>(fieldTree: FieldTree<T>): void {
  // Call the FieldTree as a function to get FieldState, then mark as touched
  fieldTree().markAsTouched();

  // Recurse into child FieldTrees (objects and arrays)
  for (const key of Object.keys(fieldTree)) {
    const child = (fieldTree as Record<string, unknown>)[key];
    if (isFieldTree(child)) {
      markAllAsTouched(child);
    }
  }
}

function isFieldTree(value: unknown): value is FieldTree<unknown> {
  return typeof value === 'function' && typeof value() === 'object' && value() !== null;
}
