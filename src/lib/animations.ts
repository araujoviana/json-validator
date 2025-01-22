import { gsap } from "gsap";

/**
 * Hides an error message element with an animation.
 *
 * @param {HTMLElement} element The error message element to hide.
 */
export function hideError(element: HTMLElement) {
    if (element) {
        gsap.to(element, {
            opacity: 0,
            height: 0,
            marginBottom: 0,
            duration: 0.2,
        });
    }
}

/**
 * Animates a list of elements to appear with a staggered entrance effect.
 *
 * @param {HTMLElement[]} elements The array of elements to animate.
 */
export function animateErrorList(elements: HTMLElement[]) {
    if (elements.length) {
        gsap.fromTo(
            elements,
            { opacity: 0, x: -100 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
        );
    }
}
