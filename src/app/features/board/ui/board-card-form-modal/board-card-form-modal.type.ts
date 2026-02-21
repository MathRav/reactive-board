import {StatusEnum} from '../../store/board-state.types';

export type CardFormModel = {
  title: string;
  description: string;
  priority: number | null;
  labels: string[];
  assignee: string | null;
  dueDate: Date | null;
  status: StatusEnum;
}
