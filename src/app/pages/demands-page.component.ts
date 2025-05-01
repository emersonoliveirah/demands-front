import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DemandService } from '../services/demand.service';
import { Demand, DemandType, DemandStatus } from '../types/demand.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demands-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './demands-page.component.html',
  styleUrl: './demands-page.component.scss',
  providers: [DemandService]
})
export class DemandsPageComponent implements OnInit {
  demands: Demand[] = [];
  demandForm: FormGroup;
  loading = false;
  editingDemandId?: string = undefined;
  demandTypes = Object.values(DemandType);
  DemandStatus = DemandStatus;
  userId = sessionStorage.getItem('username') || '';

  // ⬇️ Timer-related variables
  timerRunning = false;
  timerStartTime?: Date;
  elapsedTime = 0;
  timerInterval?: any;
  dragging = false;
  dragStartTime: number = 0;
  dragThreshold = 5; // pixels
  dragOffsetX = 0;
  dragOffsetY = 0;
  floatingTimerPosition = { top: 80, left: 80 };

  constructor(private demandService: DemandService, private fb: FormBuilder) {
    this.demandForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      autoStart: [false]
    });
  }

  ngOnInit() {
    if (!this.userId) {
      console.error('Usuário não está logado');
      // Aqui você pode redirecionar para a página de login se desejar
      return;
    }
    this.getDemands();
  }

  getDemands() {
    this.loading = true;
    this.demandService.getDemandsByUser().subscribe({
      next: (demands) => { this.demands = demands; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSubmit() {
    if (this.demandForm.invalid) return;

    const formValue = this.demandForm.value;
    // Garantir que as datas tenham segundos
    const startDate = formValue.startDate.length === 16 ? formValue.startDate + ':00' : formValue.startDate;
    const endDate = formValue.endDate.length === 16 ? formValue.endDate + ':00' : formValue.endDate;

    const demandData: Demand = {
      ...formValue,
      startDate,
      endDate,
      type: formValue.type as DemandType,
      status: DemandStatus.OPEN
    };

    if (this.editingDemandId) {
      const updatedDemand = { ...demandData, demandId: this.editingDemandId };
      this.demandService.updateDemand(updatedDemand).subscribe({
        next: () => {
          this.demandForm.reset();
          this.editingDemandId = undefined;
          this.getDemands();
        }
      });
    } else {
      this.demandService.createDemand(demandData).subscribe({
        next: () => {
          this.demandForm.reset();
          this.getDemands();
        }
      });
    }
  }

  editDemand(demand: Demand) {
    this.demandForm.patchValue({
      title: demand.title,
      description: demand.description,
      type: demand.type,
      startDate: demand.startDate ? demand.startDate.substring(0,16) : '',
      endDate: demand.endDate ? demand.endDate.substring(0,16) : '',
      autoStart: demand.autoStart
    });
    this.editingDemandId = demand.demandId;
  }

  cancelEdit() {
    this.demandForm.reset();
    this.editingDemandId = undefined;
  }

  pauseDemand(demandId?: string) {
    if (!demandId) return;
    this.demandService.pauseDemand(demandId).subscribe({
      next: () => this.getDemands()
    });
  }

  continueDemand(demandId?: string) {
    if (!demandId) return;
    this.demandService.continueDemand(demandId).subscribe({
      next: () => this.getDemands()
    });
  }

  closeDemand(demandId?: string) {
    if (!demandId) return;
    this.demandService.closeDemand(demandId).subscribe({
      next: () => this.getDemands()
    });
  }

  deleteDemand(demandId?: string) {
    if (!demandId) return;
    this.demandService.deleteDemand(demandId).subscribe({
      next: () => this.getDemands()
    });
  }

  startDemand(demandId?: string) {
    if (!demandId) return;
    this.demandService.startDemand(demandId).subscribe({
      next: () => {
        this.getDemands();
      },
      error: (error) => {
        console.error('Erro ao iniciar demanda:', error);
      }
    });
  }

  //Timer related:


  startTimer() {
    this.timerStartTime = new Date();
    this.timerRunning = true;

    // Preenche o campo de início no formulário automaticamente
    const startDateStr = this.formatDateForInput(this.timerStartTime);
    this.demandForm.patchValue({ startDate: startDateStr });

    // Timer para exibir tempo decorrido
    this.timerInterval = setInterval(() => {
      this.elapsedTime = new Date().getTime() - this.timerStartTime!.getTime();
    }, 1000);
  }

  stopTimerAndFillEndTime() {
    if (!this.timerRunning) return;

    const endTime = new Date();
    const endDateStr = this.formatDateForInput(endTime);

    this.demandForm.patchValue({ endDate: endDateStr });

    clearInterval(this.timerInterval);
    this.timerRunning = false;
    this.elapsedTime = 0;
  }

  private formatDateForInput(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`; // compatível com input type="datetime-local"
  }

  //Draggg

  startDrag(event: MouseEvent) {
    this.dragging = true;
    this.dragStartTime = performance.now();

    const el = event.target as HTMLElement;
    this.floatingTimerPosition.left = el.offsetLeft;
    this.floatingTimerPosition.top = el.offsetTop;

    this.dragOffsetX = event.clientX - this.floatingTimerPosition.left;
    this.dragOffsetY = event.clientY - this.floatingTimerPosition.top;
  }

  onDrag(event: Event): void {
    const mouseEvent = event as MouseEvent;
    if (this.dragging) {
      const newLeft = mouseEvent.clientX - this.dragOffsetX;
      const newTop = mouseEvent.clientY - this.dragOffsetY;

      this.floatingTimerPosition.left = newLeft;
      this.floatingTimerPosition.top = newTop;

      const el = document.querySelector('.floating-timer') as HTMLElement;
      if (el) {
        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;
      }
    }
  }


  stopDrag(event: Event) {
    const mouseEvent = event as MouseEvent;

    if (this.dragging) {
      const timeHeld = performance.now() - this.dragStartTime;
      const moved =
        Math.abs(mouseEvent.movementX) > this.dragThreshold ||
        Math.abs(mouseEvent.movementY) > this.dragThreshold;

      this.dragging = false;

      // Se o mouse não foi arrastado de fato, consideramos um clique
      if (!moved && timeHeld < 200) {
        this.stopTimerAndFillEndTime();
      }
    }
  }
}
