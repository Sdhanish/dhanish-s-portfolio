export function scrollToSection(target: string | HTMLElement, offset = 80) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  const lenis = (window as any).__lenis;
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(element, { offset: -offset, duration: 1.0 });
  } else {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}
