import { AfterViewInit, Component, ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, NgbModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  constructor(private ngbModal: NgbModal) {}

  @ViewChild('popup') public popup!: TemplateRef<string>;
  @ViewChild('customBackgroundModal') public customBackgroundModal!: TemplateRef<string>;

  title = 'SpinTheWheel';

  names = [
    'test name 0',
    'test name 1',
    'test name 2',
    'test name 3',
    'test name 4',
    'test name 5',
    'test name 6',
    'test name 7',
    'test name 8',
    'test name 9',
  ];

  div!: HTMLElement;
  textbox: string = '';
  popupRef: NgbModalRef | null = null;
  customBackgroundModalRef: NgbModalRef | null = null;

  chosenItem: string = '';
  
  customBackground: string = '';
  customUrlTextBoxValue: string = '';

  ngAfterViewInit() {
    this.div = document.getElementById('wheel')!;
  }

  spin(): void {
    this.div.style.transition = `transform 2s ease-in-out`;
    const randomPick = this.generateRandomNumber(0, this.names.length - 1);
    this.chosenItem = this.names[randomPick];
    let x = 1440 - (randomPick/(this.names.length) * 360 + this.getRandomPxOffset());
    this.div.style.transform = `rotate(${x}deg)`;
    setTimeout(() => this.openPopup(), 2500);
  }

  reset(): void {
    this.div.style.transition = `transform 0.6s ease-in-out`;
    this.div.style.transform = `rotate(0deg)`;
  }

  generateRandomNumber(min: number, max: number): number {
    const range = max - min + 1;
    const randomNum = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return (randomNum % range) + min;
  }

  getRandomPxOffset(): number {
    return this.generateRandomNumber(-5, 5);
  }

  submit(): void {
    if (this.textbox !== '') {
      this.names.push(this.textbox);
      this.textbox = '';
    }
  }

  openPopup() {
    confetti({
      particleCount: 300,
      spread: 100,
      zIndex: 9999,
    });
    this.popupRef = this.ngbModal.open(this.popup, { centered: true, windowClass: 'custom-modal' });
    setTimeout(() => this.reset(), 1000);
  }

  openCustomBackgroundModal() {
    if (this.customBackground) {
      this.customBackground = '';
    } else {
      this.customBackgroundModalRef = this.ngbModal.open(this.customBackgroundModal, { centered: true, windowClass: 'custom-background-modal' });
    }
  }

  setCustomBackground() {
    this.customBackground = this.customUrlTextBoxValue;
    this.customBackgroundModalRef?.close();
  }
}
