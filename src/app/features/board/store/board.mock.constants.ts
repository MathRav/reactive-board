import {BoardState, Card, List, StatusEnum} from './board-state.types';
import {Id} from '@core/store/entity-base.type';

// ── Card IDs ────────────────────────────────────────────────
const TODO_1 = 'card-todo-1';
const TODO_2 = 'card-todo-2';
const TODO_3 = 'card-todo-3';
const DOING_1 = 'card-doing-1';
const DOING_2 = 'card-doing-2';
const DONE_1 = 'card-done-1';
const DONE_2 = 'card-done-2';

// ── List IDs ────────────────────────────────────────────────
const LIST_TODO = 'list-todo';
const LIST_DOING = 'list-doing';
const LIST_DONE = 'list-done';

// ── Timestamp helpers ───────────────────────────────────────
const DAY = 86_400_000;
const now = 1_740_000_000_000; // fixed reference point for deterministic mocks
const daysAgo = (n: number) => now - n * DAY;
const daysFromNow = (n: number) => now + n * DAY;

// ── Cards ───────────────────────────────────────────────────
export const MOCK_CARDS: Record<Id, Card> = {
  [TODO_1]: {
    id: TODO_1,
    title: 'Set up CI pipeline',
    description: 'Configure GitHub Actions for lint, test, and build on every PR.',
    priority: 1,
    labels: ['infra', 'devops'],
    assignee: 'alice',
    dueDate: daysFromNow(3),
    status: StatusEnum.TODO,
    lastUpdatedAt: daysAgo(1),
  },
  [TODO_2]: {
    id: TODO_2,
    title: 'Design transaction list component',
    description: 'Create the Figma mockup and Angular component skeleton for the transactions page.',
    priority: 2,
    labels: ['ui', 'design'],
    assignee: null,
    dueDate: daysFromNow(7),
    status: StatusEnum.TODO,
    lastUpdatedAt: daysAgo(2),
  },
  [TODO_3]: {
    id: TODO_3,
    title: 'Add input validation to card form',
    description: 'Title must be non-empty, priority between 1-5, due date cannot be in the past.',
    priority: 3,
    labels: ['ui', 'validation'],
    assignee: 'bob',
    dueDate: null,
    status: StatusEnum.TODO,
    lastUpdatedAt: daysAgo(4),
  },
  [DOING_1]: {
    id: DOING_1,
    title: 'Implement drag-and-drop reorder',
    description: 'Cards should be reorderable within a list and movable across lists using CDK DragDrop.',
    priority: 1,
    labels: ['ui', 'feature'],
    assignee: 'alice',
    dueDate: daysFromNow(1),
    status: StatusEnum.DOING,
    lastUpdatedAt: daysAgo(0),
  },
  [DOING_2]: {
    id: DOING_2,
    title: 'Integrate NgRx Signal Store',
    description: 'Migrate board state from component-level signals to a shared signalStore with withState, withComputed, withMethods.',
    priority: 1,
    labels: ['architecture', 'ngrx'],
    assignee: 'bob',
    dueDate: daysFromNow(2),
    status: StatusEnum.DOING,
    lastUpdatedAt: daysAgo(1),
  },
  [DONE_1]: {
    id: DONE_1,
    title: 'Project scaffolding',
    description: 'Initialize Angular 21 workspace with PrimeNG, Tailwind 4, and Vitest.',
    priority: null,
    labels: ['infra'],
    assignee: 'alice',
    dueDate: null,
    status: StatusEnum.DONE,
    lastUpdatedAt: daysAgo(10),
  },
  [DONE_2]: {
    id: DONE_2,
    title: 'Define board data model',
    description: 'Create Card, List, BoardState types and initial store shape.',
    priority: null,
    labels: ['architecture'],
    assignee: 'bob',
    dueDate: null,
    status: StatusEnum.DONE,
    lastUpdatedAt: daysAgo(8),
  },
};

// ── Lists ───────────────────────────────────────────────────
const MOCK_LISTS: List[] = [
  {
    id: LIST_TODO,
    title: 'To Do',
    cardIds: [TODO_1, TODO_2, TODO_3],
  },
  {
    id: LIST_DOING,
    title: 'In Progress',
    cardIds: [DOING_1, DOING_2],
  },
  {
    id: LIST_DONE,
    title: 'Done',
    cardIds: [DONE_1, DONE_2],
  },
];

// ── Full board state ────────────────────────────────────────
export const MOCK_BOARD_STATE = {
  boardId: 'board-fintech-001',
  lists: MOCK_LISTS,
  selectedCardId: null,
  filterQuery: '',
  loading:false,
  history: [],
  future: []
} as const satisfies BoardState;
