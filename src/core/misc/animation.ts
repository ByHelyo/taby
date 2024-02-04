export async function enter(element: HTMLElement, transition: string) {
  element.classList.remove("taby-hidden");

  element.classList.add(`taby-${transition}-enter`);
  element.classList.add(`taby-${transition}-enter-start`);

  await nextFrame();

  element.classList.remove(`taby-${transition}-enter-start`);
  element.classList.add(`taby-${transition}-enter-end`);

  await afterTransition(element);

  element.classList.remove(`taby-${transition}-enter-end`);
  element.classList.remove(`taby-${transition}-enter`);
}

export async function leave(element: HTMLElement, transition: string) {
  element.classList.add(`taby-${transition}-leave`);
  element.classList.add(`taby-${transition}-leave-start`);

  await nextFrame();

  element.classList.remove(`taby-${transition}-leave-start`);
  element.classList.add(`taby-${transition}-leave-end`);

  await afterTransition(element);

  element.classList.remove(`taby-${transition}-leave-end`);
  element.classList.remove(`taby-${transition}-leave`);

  element.classList.add("taby-hidden");
}

async function nextFrame() {
  return new Promise(function (resolve) {
    requestAnimationFrame(function () {
      requestAnimationFrame(resolve);
    });
  });
}

function afterTransition(element: HTMLElement): Promise<void> {
  return new Promise(function (resolve) {
    const duration =
      Number(getComputedStyle(element).transitionDuration.replace("s", "")) *
      1000;

    setTimeout(function () {
      resolve();
    }, duration);
  });
}
