import {Component, computed, effect, input, output, signal} from '@angular/core';
import {Card, StatusEnum} from '../../store/board-state.types';
import {CardFormModel} from './board-card-form-modal.type';
import {CardUpdateInput, CreateCardInput} from '../../store/board-actions.type';
import {cardToFormModel, emptyFormModel, formModelToCreateInput, formModelToUpdateInput} from './board-card-form-modal.mapper';
import {form, FormField, required} from '@angular/forms/signals';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {Rating} from 'primeng/rating';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import {Button} from 'primeng/button';
import {Message} from 'primeng/message';
import {BoardChip} from '../board-chip/board-chip';
import {ErrorMessage} from '../../../../forms/ui/error-message';

@Component({
  selector: 'board-card-form-modal',
  templateUrl: 'board-card-form-modal.html',
  imports: [
    IftaLabel,
    InputText,
    Textarea,
    Rating,
    Select,
    DatePicker,
    Button,
    Message,
    FormField,
    BoardChip,
    ErrorMessage,
  ],
  host: {
    class: 'w-full flex flex-col p-4 gap-4',
  },
})
export class BoardCardFormModal {
  readonly card = input<Card>();
  readonly created = output<CreateCardInput>();
  readonly updated = output<CardUpdateInput>();
  readonly closed = output<void>();

  protected readonly isUpdateMode = computed(() => !!this.card());
  protected readonly hasAttemptedSubmit = signal(false);
  protected readonly labelForm = form(signal(''), (titleSchema) => {
    required(titleSchema, {message: 'Label is required'})
  });

  protected readonly statusOptions = [
    {label: 'Todo', value: StatusEnum.TODO},
    {label: 'Doing', value: StatusEnum.DOING},
    {label: 'Done', value: StatusEnum.DONE},
  ];

  private readonly cardFormModel = signal<CardFormModel>({
    title: '',
    description: '',
    priority: null,
    labels: [],
    assignee: null,
    dueDate: null,
    status: StatusEnum.TODO,
  });

  protected readonly cardForm = form(this.cardFormModel, (schemaPath) => {
    required(schemaPath.title, {message: 'Title is required'});
  });

  constructor() {
    effect(() => {
      const card = this.card();
      this.cardFormModel.set(card ? cardToFormModel(card) : emptyFormModel());
    });
  }

  protected addLabel(): void {
    const label = this.labelForm().value().trim();
    if (!label) return;
    const current = this.cardForm.labels().value();
    if (!current.includes(label)) {
      this.cardForm.labels().setControlValue([...current, label]);
    }
    this.labelForm().setControlValue('');
  }

  protected removeLabel(label: string): void {
    const current = this.cardForm.labels().value();
    this.cardForm.labels().setControlValue(current.filter(l => l !== label));
  }

  protected save(): void {
    this.hasAttemptedSubmit.set(true);
    this.cardForm().markAsTouched();
    if (this.cardForm().invalid()) return;
    const v = this.cardForm().value();
    if (this.isUpdateMode()) {
      this.updated.emit(formModelToUpdateInput(v));
    } else {
      this.created.emit(formModelToCreateInput(v));
    }
  }

  protected close(): void {
    this.closed.emit();
  }
}
