# HRMS-UI — Conventions d'animation et d'architecture frontend

> Ce fichier est lu par Claude Code à chaque session. Il définit les règles
> non-négociables de ce projet Angular 16.

---

## Stack d'animation

| Outil | Quand l'utiliser |
|---|---|
| **GSAP** | Animations complexes, timelines séquentielles, count-up KPI, stagger de cards, transitions de page |
| **@angular/animations** | Transitions d'état simples liées au router (`[:enter]`, `[:leave]`), animations déclaratives dans le template |
| **@formkit/auto-animate** | Ajout / suppression / réordonnancement d'items dans une liste — une directive, zéro JS |
| **Lottie (ngx-lottie)** | Empty states animés, illustrations SVG interactives, icônes d'état (loading, success, error) |
| **CSS transitions** | Hover states, changements de couleur, opacité simple — jamais pour le layout |

### Règle de décision rapide

```
Animation implique du DOM timing précis ?  → GSAP
Animation réagit à un état Angular ?       → @angular/animations
Liste qui change dynamiquement ?           → @formkit/auto-animate
Illustration vectorielle ?                 → Lottie
Survol / couleur / opacité simple ?        → CSS transition
```

---

## Patterns obligatoires

### 1. Toujours initialiser GSAP dans `ngAfterViewInit`

```typescript
// ✅ Correct
ngAfterViewInit(): void {
  this.ctx = gsap.context(() => {
    gsap.from('.card', { y: 20, opacity: 0, stagger: 0.08 });
  }, this.el);
}

// ❌ Interdit — le DOM n'existe pas encore dans ngOnInit
ngOnInit(): void {
  gsap.from('.card', { ... }); // CRASH ou sélecteur vide
}
```

### 2. Toujours nettoyer GSAP dans `ngOnDestroy`

```typescript
private ctx!: gsap.Context;

ngAfterViewInit(): void {
  this.ctx = gsap.context(() => { /* animations */ }, this.el);
}

ngOnDestroy(): void {
  this.ctx.revert(); // Annule toutes les animations et inline styles
}
```

### 3. Scoper GSAP avec `ElementRef` — jamais `document.querySelector` global

```typescript
// ✅ Correct — scoped au composant
constructor(private el: ElementRef) {}

ngAfterViewInit(): void {
  this.ctx = gsap.context(() => {
    gsap.from('.stat-card', { y: 20, opacity: 0 });
  }, this.el); // this.el = scope
}

// ❌ Risque — anime TOUS les .stat-card du document
gsap.from('.stat-card', { ... });
```

### 4. `ViewChild` pour les éléments Chart.js

```typescript
@ViewChild('myChart') chartRef!: ElementRef<HTMLCanvasElement>;

// Toujours vérifier null avant d'accéder au canvas
private renderChart(): void {
  const ctx = this.chartRef?.nativeElement.getContext('2d');
  if (!ctx) return;
  // ...
}
```

### 5. `ngZone.run()` pour GSAP count-up (change detection)

```typescript
// GSAP tourne hors de la zone Angular par défaut.
// Pour animer une valeur bindée dans le template :
constructor(private ngZone: NgZone) {}

private countUp(target: number): void {
  this.ngZone.run(() => {
    gsap.to(this.counter, {
      value: target,
      duration: 1.4,
      snap: { value: 1 },
      ease: 'power3.out'
    });
  });
}
```

---

## Règles de performance

### Propriétés CSS à animer (GPU-friendly)

```
✅ transform: translateX / translateY / scale / rotate
✅ opacity
❌ width / height / top / left / margin / padding → force reflow
❌ background-color dans une boucle → préférer opacity
```

### `will-change` — usage restrictif

```scss
// Uniquement sur les éléments qui VONT animer imminemment
.card-animating {
  will-change: transform, opacity;
}
// Retirer après l'animation avec clearProps
```

### `clearProps` obligatoire après entrée

```typescript
gsap.from('.card', {
  y: 20,
  opacity: 0,
  duration: 0.4,
  clearProps: 'transform,opacity' // ← retire les inline styles après
});
```

### Éviter les sélecteurs globaux dans GSAP

```typescript
// ❌ Trop large — impacte d'autres composants
gsap.from('mat-card', { ... });

// ✅ Scoped via gsap.context(fn, elementRef)
this.ctx = gsap.context(() => {
  gsap.from('mat-card', { ... });
}, this.el);
```

---

## Structure d'un composant animé

```typescript
@Component({ ... })
export class MyAnimatedComponent implements AfterViewInit, OnDestroy {

  // 1. ViewChild pour les éléments DOM directs
  @ViewChild('container') containerRef!: ElementRef;

  // 2. Contexte GSAP pour le cleanup
  private gsapCtx!: gsap.Context;

  // 3. Valeurs animées par GSAP (count-up, etc.)
  animCount = { value: 0 };

  constructor(
    private el: ElementRef,
    private ngZone: NgZone
  ) {}

  // 4. Animations dans ngAfterViewInit UNIQUEMENT
  ngAfterViewInit(): void {
    this.gsapCtx = gsap.context(() => {
      this.runEntryAnimation();
    }, this.el);
  }

  // 5. Cleanup dans ngOnDestroy OBLIGATOIRE
  ngOnDestroy(): void {
    this.gsapCtx?.revert();
  }

  private runEntryAnimation(): void {
    const tl = gsap.timeline();
    tl.from('.item', {
      y: 16,
      opacity: 0,
      stagger: 0.07,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    });
  }
}
```

---

## Tailwind CSS — règles d'usage

- **Préfixe obligatoire `tw-`** sur toutes les classes utilitaires : `tw-flex`, `tw-grid`, `tw-p-4`
- **`preflight` désactivé** — ne jamais l'activer, les styles de base viennent d'Angular Material
- **Tokens HRMS disponibles** via Tailwind : `tw-bg-primary`, `tw-text-muted`, `tw-shadow-md`
- **Ne jamais utiliser** les classes Tailwind sur des composants Angular Material (`mat-card`, `mat-button`) — risque de conflit

```html
<!-- ✅ Tailwind sur un div custom -->
<div class="tw-flex tw-items-center tw-gap-4 tw-p-6">

<!-- ❌ Sur un composant Material -->
<mat-card class="tw-p-6">  ← risque de conflit avec le padding Material
```

---

## Lottie — conventions

```typescript
// Toujours charger depuis src/assets/lottie/
animationOptions: AnimationOptions = {
  path: '/assets/lottie/empty-state.json',
  loop: true,
  autoplay: true
};
```

```html
<!-- Dans le template -->
<ng-lottie [options]="animationOptions" width="160px"></ng-lottie>
```

Fichiers Lottie à placer dans `src/assets/lottie/`. Sources recommandées : [LottieFiles](https://lottiefiles.com).

---

## @formkit/auto-animate — convention

```typescript
import { useAutoAnimate } from '@formkit/auto-animate/angular';

@Component({ ... })
export class MyListComponent {
  @ViewChild('listEl') listEl!: ElementRef;

  ngAfterViewInit(): void {
    autoAnimate(this.listEl.nativeElement);
  }
}
```

```html
<ul #listEl>
  <li *ngFor="let item of items">{{ item.name }}</li>
</ul>
```

---

## ng2-charts — import par module feature

`NgChartsModule` doit être importé **dans le module feature** qui l'utilise, pas dans `SharedModule` (évite de charger chart.js dans tous les modules).

```typescript
// dashboard.module.ts
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [NgChartsModule, ...]
})
export class DashboardModule {}
```