import { AfterViewInit, Component, ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import confetti from 'canvas-confetti';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, NgbModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  yay = new Audio();
  goofyahh = new Audio();
  names: string[] = [];
  constructor(private ngbModal: NgbModal) {
    // initializing audio files
    this.yay.src = "assets/yay.mp3";
    this.goofyahh.src = "assets/goofyahh.mp3";
    this.yay.volume = 0.2;
    this.goofyahh.volume = 0.1;
    this.yay.load();
    this.goofyahh.load();

    // get names from local storage
    this.names = JSON.parse(localStorage.getItem('spin-the-wheel-names') as string) || [];
  }

  @ViewChild('popup') public popup!: TemplateRef<string>;
  @ViewChild('customBackgroundModal') public customBackgroundModal!: TemplateRef<string>;

  title = 'SpinTheWheel';

  div!: HTMLElement;
  textbox: string = '';
  popupRef: NgbModalRef | null = null;
  customBackgroundModalRef: NgbModalRef | null = null;

  chosenItem: string = '';
  chosenItemIndex!: number;
  
  customBackground: string = '';
  customUrlTextBoxValue: string = '';

  ngAfterViewInit() {
    this.div = document.getElementById('wheel')!;
  }

  spin(): void {
    setTimeout(() => this.goofyahh.play(), 400);
    this.div.style.transition = `transform 2s ease-in-out`;
    this.chosenItemIndex = this.generateRandomNumber(0, this.names.length - 1);
    this.chosenItem = this.names[this.chosenItemIndex];
    let x = 1440 - (this.chosenItemIndex/(this.names.length) * 360 + this.getRandomPxOffset());
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
    this.updateListInLocalStorage();
  }

  openPopup() {
    this.yay.play();
    confetti({
      particleCount: 300,
      spread: 100,
      zIndex: 9999,
    });
    this.popupRef = this.ngbModal.open(this.popup, { centered: true, windowClass: 'selected-popup', keyboard: false, backdrop : 'static', });
  }

  closePopup() {
    this.popupRef?.close();
    this.reset();
  }

  closePopupAndRemoveItem() {
    this.popupRef?.close();
    this.reset();
    this.names.splice(this.chosenItemIndex, 1);
    this.updateListInLocalStorage();
  }

  openCustomBackgroundModal() {
    if (this.customBackground) {
      this.customBackground = '';
    } else {
      this.customBackgroundModalRef = this.ngbModal.open(this.customBackgroundModal, { centered: true, windowClass: 'custom-background-modal' });
    }
  }

  updateListInLocalStorage() {
    localStorage.setItem('spin-the-wheel-names', JSON.stringify(this.names));
  }

  clearListInLocalStorage() {
    localStorage.removeItem('spin-the-wheel-names');
  }

  clearList() {
    this.names = [];
    this.clearListInLocalStorage();
  }

  removeItem(index: number) {
    this.names.splice(index, 1);
    this.updateListInLocalStorage();
  }

  setCustomBackground() {
    this.customBackground = this.customUrlTextBoxValue;
    this.customBackgroundModalRef?.close();
  }
}
