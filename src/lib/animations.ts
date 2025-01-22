import { gsap } from "gsap";

export function hideElement(element: HTMLElement) {
    if (element) {
        gsap.to(element, {
            opacity: 0,
            height: 0,
            marginBottom: 0,
            duration: 0.2,
        });
    }
}

export function animateElementList(elements: HTMLElement[]) {
    if (elements.length) {
        gsap.fromTo(
            elements,
            { opacity: 0, x: -100 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
        );
    }
}
