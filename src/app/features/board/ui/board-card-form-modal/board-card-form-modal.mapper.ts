import {Card, StatusEnum} from '../../store/board-state.types';
import {CardUpdateInput, CreateCardInput} from '../../store/board-actions.type';
import {CardFormModel} from './board-card-form-modal.type';

export function cardToFormModel(card: Card): CardFormModel {
  return {
    title: card.title,
    description: card.description,
    priority: card.priority,
    labels: [...card.labels],
    assignee: card.assignee,
    dueDate: card.dueDate ? new Date(card.dueDate) : null,
    status: card.status,
  };
}

export function emptyFormModel(): CardFormModel {
  return {
    title: '',
    description: '',
    priority: null,
    labels: [],
    assignee: null,
    dueDate: null,
    status: StatusEnum.TODO,
  };
}

export function formModelToCreateInput(model: CardFormModel): CreateCardInput {
  return {
    title: model.title,
    description: model.description,
    priority: model.priority,
    labels: model.labels,
    assignee: model.assignee || null,
    dueDate: model.dueDate ? model.dueDate.getTime() : null,
    status: model.status,
  };
}

export function formModelToUpdateInput(model: CardFormModel): CardUpdateInput {
  return {
    title: model.title,
    description: model.description,
    priority: model.priority,
    labels: model.labels,
    assignee: model.assignee || null,
    dueDate: model.dueDate ? model.dueDate.getTime() : null,
    status: model.status,
  };
}
