import { Injectable, NgZone } from '@angular/core';
import { gsap } from 'gsap';

/**
 * Service d'animation GSAP centralisé.
 *
 * Chaque méthode retourne un gsap.Context que le composant appelant
 * doit révoquer dans ngOnDestroy via ctx.revert().
 *
 * Exemple d'utilisation :
 *
 *   private ctx!: gsap.Context;
 *
 *   ngAfterViewInit(): void {
 *     this.ctx = this.animService.fadeInUp(this.el.nativeElement);
 *   }
 *
 *   ngOnDestroy(): void {
 *     this.ctx.revert();
 *   }
 */
@Injectable({ providedIn: 'root' })
export class AnimationService {

  constructor(private ngZone: NgZone) {}

  // ── 1. fadeInUp ────────────────────────────────────────────
  /**
   * Entrée standard : l'élément monte de `offsetY` pixels et passe
   * de opacité 0 à 1.
   *
   * @param scope  Élément DOM racine (passez ElementRef.nativeElement)
   * @param delay  Délai en secondes avant le début (défaut 0)
   * @param offsetY  Distance de départ en px (défaut 20)
   */
  fadeInUp(
    scope: Element,
    delay  = 0,
    offsetY = 20
  ): gsap.Context {
    return gsap.context(() => {
      gsap.from(scope, {
        y:          offsetY,
        opacity:    0,
        duration:   0.45,
        delay,
        ease:       'power3.out',
        clearProps: 'transform,opacity'
      });
    }, scope);
  }

  // ── 2. staggerCards ───────────────────────────────────────
  /**
   * Entrée en cascade pour une liste de cards.
   * Chaque card entre depuis le bas avec un délai échelonné.
   *
   * @param scope       Élément conteneur (les cards sont ses enfants directs)
   * @param selector    Sélecteur CSS des cards dans le scope (défaut '.card')
   * @param staggerGap  Délai entre chaque card en secondes (défaut 0.08)
   */
  staggerCards(
    scope: Element,
    selector  = '.card',
    staggerGap = 0.08
  ): gsap.Context {
    return gsap.context(() => {
      gsap.from(selector, {
        y:          24,
        opacity:    0,
        duration:   0.45,
        stagger:    staggerGap,
        ease:       'power3.out',
        clearProps: 'transform,opacity'
      });
    }, scope);
  }

  // ── 3. countUp ────────────────────────────────────────────
  /**
   * Anime un compteur numérique dans un élément DOM (textContent).
   * Utilise ngZone pour déclencher la détection de changements Angular.
   *
   * @param element   Élément DOM dont le textContent sera mis à jour
   * @param from      Valeur de départ
   * @param to        Valeur finale
   * @param duration  Durée en secondes (défaut 1.4)
   * @param prefix    Préfixe affiché avant le nombre (ex: '$', '€')
   * @param suffix    Suffixe affiché après le nombre (ex: '%', 'k')
   */
  countUp(
    element:  Element,
    from:     number,
    to:       number,
    duration  = 1.4,
    prefix    = '',
    suffix    = ''
  ): gsap.Context {
    return gsap.context(() => {
      const counter = { value: from };

      this.ngZone.run(() => {
        gsap.to(counter, {
          value:    to,
          duration,
          ease:     'power3.out',
          snap:     { value: 1 },
          onUpdate: () => {
            element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
          }
        });
      });
    }, element);
  }

  // ── 4. pageTransition ─────────────────────────────────────
  /**
   * Transition d'entrée de page — à appeler dans ngAfterViewInit
   * du composant de page (celui qui contient `.page`).
   *
   * Anime le conteneur `.page` en fondu + montée douce.
   *
   * @param scope    Élément racine du composant page
   * @param selector Sélecteur du conteneur principal (défaut '.page')
   */
  pageTransition(
    scope: Element,
    selector = '.page'
  ): gsap.Context {
    return gsap.context(() => {
      gsap.from(selector, {
        opacity:    0,
        y:          14,
        duration:   0.35,
        ease:       'power2.out',
        clearProps: 'transform,opacity'
      });
    }, scope);
  }

  // ── 5. Utilitaire : stagger sur n'importe quel sélecteur ──
  /**
   * Stagger générique — utile pour des listes d'items, lignes de tableau, etc.
   *
   * @param scope     Élément conteneur pour le scope GSAP
   * @param selector  Sélecteur CSS des éléments à animer
   * @param options   Overrides partiels des options GSAP
   */
  stagger(
    scope:    Element,
    selector: string,
    options:  Partial<gsap.TweenVars> = {}
  ): gsap.Context {
    return gsap.context(() => {
      gsap.from(selector, {
        y:          16,
        opacity:    0,
        duration:   0.35,
        stagger:    0.07,
        ease:       'power2.out',
        clearProps: 'transform,opacity',
        ...options
      });
    }, scope);
  }

  // ── 6. Reveal depuis la gauche (activité, listes latérales) ─
  /**
   * Entrée depuis la gauche — pour les listes d'activité récente,
   * items de notifications, etc.
   *
   * @param scope    Élément conteneur
   * @param selector Sélecteur des éléments
   */
  slideInLeft(
    scope:    Element,
    selector: string
  ): gsap.Context {
    return gsap.context(() => {
      gsap.from(selector, {
        x:          -24,
        opacity:    0,
        duration:   0.35,
        stagger:    0.07,
        ease:       'power2.out',
        clearProps: 'transform,opacity'
      });
    }, scope);
  }

  // ── 7. Grow depuis la gauche (barres de progression) ──────
  /**
   * Anime des barres de progression depuis scaleX = 0.
   * Utilise scaleX pour ne pas perturber la largeur CSS.
   *
   * @param scope    Élément conteneur
   * @param selector Sélecteur des barres (ex: '.dept-bar-fill')
   */
  growBars(
    scope:    Element,
    selector: string
  ): gsap.Context {
    return gsap.context(() => {
      gsap.from(selector, {
        scaleX:          0,
        transformOrigin: 'left center',
        duration:        0.7,
        stagger:         0.12,
        ease:            'power2.out',
        clearProps:      'transform'
      });
    }, scope);
  }
}