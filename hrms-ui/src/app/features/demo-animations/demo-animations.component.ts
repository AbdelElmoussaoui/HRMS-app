import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { gsap } from 'gsap';
import { autoAnimate } from '@formkit/auto-animate';

import { AnimationService } from '../../core/services/animation.service';

interface DemoCard {
  icon:    string;
  label:   string;
  value:   string;
  accent:  string;
}

interface ListItem {
  id:    number;
  name:  string;
  dept:  string;
}

@Component({
  selector: 'app-demo-animations',
  templateUrl: './demo-animations.component.html',
  styleUrls: ['./demo-animations.component.scss']
})
export class DemoAnimationsComponent implements OnInit, AfterViewInit, OnDestroy {

  // ── Section 1 : Stagger cards ────────────────────────────
  @ViewChild('cardsGrid')  cardsGridRef!:  ElementRef<HTMLElement>;

  cards: DemoCard[] = [
    { icon: 'people',        label: 'Employees',  value: '124',  accent: '#10b981' },
    { icon: 'schedule',      label: 'Pending',    value: '8',    accent: '#f59e0b' },
    { icon: 'check_circle',  label: 'Approved',   value: '56',   accent: '#06b6d4' },
    { icon: 'trending_up',   label: 'Growth',     value: '+12%', accent: '#8b5cf6' },
    { icon: 'business',      label: 'Departments',value: '5',    accent: '#ec4899' },
    { icon: 'event_note',    label: 'Leave days', value: '320',  accent: '#f97316' }
  ];

  // ── Section 2 : Count-up KPI ─────────────────────────────
  @ViewChild('kpiValue') kpiValueRef!: ElementRef<HTMLElement>;

  // ── Section 3 : Auto-animate list ───────────────────────
  @ViewChild('autoList') autoListRef!: ElementRef<HTMLUListElement>;

  listItems: ListItem[] = [
    { id: 1, name: 'Alice Martin',    dept: 'Engineering' },
    { id: 2, name: 'Youssef El Amrani', dept: 'Engineering' },
    { id: 3, name: 'Nora Dupont',     dept: 'HR' }
  ];
  private nextId = 4;

  private readonly newNames = [
    ['Sara Okafor',    'Finance'],
    ['Marco Ricci',    'Marketing'],
    ['Léa Fontaine',   'Marketing'],
    ['Mehdi Bouazza',  'Sales'],
    ['Chen Wei',       'Engineering'],
    ['Antoine Moreau', 'Finance']
  ];
  private nameIndex = 0;

  // ── Section 4 : Skeleton → content ──────────────────────
  // `?` car l'élément est derrière *ngIf — peut être undefined
  @ViewChild('revealCard') revealCardRef?: ElementRef<HTMLElement>;

  loadingContent = true;
  showContent    = false;

  // ── GSAP contexts ────────────────────────────────────────
  private ctxCards!:  gsap.Context;
  private ctxKpi!:    gsap.Context;
  private ctxReveal?: gsap.Context; // optionnel : assigné seulement si reveal a lieu

  constructor(
    private el:         ElementRef,
    private animService: AnimationService
  ) {}

  ngOnInit(): void {
    // Simule un fetch de 2 secondes avant d'afficher le contenu
    setTimeout(() => {
      this.loadingContent = false;
      this.showContent    = true;
      // L'animation est déclenchée après que Angular a mis à jour le DOM
      setTimeout(() => this.animateReveal(), 30);
    }, 2000);
  }

  ngAfterViewInit(): void {
    // 1. Stagger des cards
    this.ctxCards = this.animService.staggerCards(
      this.cardsGridRef.nativeElement,
      '.demo-card'
    );

    // 2. Count-up KPI : 0 → 1247
    this.ctxKpi = this.animService.countUp(
      this.kpiValueRef.nativeElement,
      0,
      1247,
      2.0
    );

    // 3. Auto-animate sur la liste
    if (this.autoListRef) {
      autoAnimate(this.autoListRef.nativeElement);
    }

    // 4. Entrée de page
    this.animService.pageTransition(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctxCards?.revert();
    this.ctxKpi?.revert();
    this.ctxReveal?.revert();
  }

  // ── Actions auto-animate ─────────────────────────────────

  addItem(): void {
    if (this.nameIndex >= this.newNames.length) { this.nameIndex = 0; }
    const [name, dept] = this.newNames[this.nameIndex++];
    this.listItems = [
      { id: this.nextId++, name, dept },
      ...this.listItems
    ];
  }

  removeItem(id: number): void {
    this.listItems = this.listItems.filter(i => i.id !== id);
  }

  shuffleItems(): void {
    this.listItems = [...this.listItems].sort(() => Math.random() - 0.5);
  }

  // ── Reveal après skeleton ────────────────────────────────

  private animateReveal(): void {
    if (!this.revealCardRef) return;
    this.ctxReveal = gsap.context(() => {
      gsap.from(this.revealCardRef.nativeElement, {
        y:          24,
        opacity:    0,
        duration:   0.5,
        ease:       'power3.out',
        clearProps: 'transform,opacity'
      });
    }, this.revealCardRef.nativeElement);
  }
}