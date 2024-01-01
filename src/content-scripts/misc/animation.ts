export async function enter(element: HTMLElement, transition: string) {
  element.classList.remove("hidden");

  element.classList.add(`${transition}-enter`);
  element.classList.add(`${transition}-enter-start`);

  await nextFrame();

  element.classList.remove(`${transition}-enter-start`);
  element.classList.add(`${transition}-enter-end`);

  await afterTransition(element);

  element.classList.remove(`${transition}-enter-end`);
  element.classList.remove(`${transition}-enter`);
}

export async function leave(element: HTMLElement, transition: string) {
  element.classList.add(`${transition}-leave`);
  element.classList.add(`${transition}-leave-start`);

  await nextFrame();

  element.classList.remove(`${transition}-leave-start`);
  element.classList.add(`${transition}-leave-end`);

  await afterTransition(element);

  element.classList.remove(`${transition}-leave-end`);
  element.classList.remove(`${transition}-leave`);

  element.classList.add("hidden");
}

export async function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

function afterTransition(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const duration =
      Number(getComputedStyle(element).transitionDuration.replace("s", "")) *
      1000;

    setTimeout(() => {
      resolve();
    }, duration);
  });
}
