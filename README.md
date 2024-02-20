<h1 align="center">Taby</h1>

<div align="center">
  
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

</div>

<div align=center>
  <img width="600" alt="Taby" src="https://github.com/ByHelyo/taby/assets/70762494/d3836640-7db0-4961-97ac-3e3a89c0ac42" />
</div>

<h2>About</h2>

`Taby` is a simple, lightweight tab switcher extension designed to optimize your browsing experience, available on Chrome and Firefox. Empowering users with efficient, mouse-free tab navigation through an intuitive command palette.

<h3>Features</h3>

- Display all open tabs in current window via a convenient command palette or popup.
- Efficient tab filtering options
  - Search by title, URL, or index in the current window
  - Ability to fuzzy search open tabs.
  - Powered by a fuzzy search filtering.
  - Navigate between tabs using arrow keys
  - Switch to a tab with 'Enter' or a simple click
- Customize the appearance with options for light and dark modes
- Shortcut for duplicate tab.

### Supports:

![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)
![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white)

<h2>Getting Started</h2>

<h3>Usage</h3>

- `Alt+Q` to open/close the popup.
- `Alt+W` to open/close the command palette.
- `Escape` to close the menu.
- `Enter` to switch to the selected tab.
- `↑` `↓` arrows to navigate and select tabs above and below the currently selected tab.
- Optional shortcut to duplicate current tab.

<h2>Build</h2>

Requirements:

- pnpm 8
- Node 20

Once you've met the requirements and cloned the project, download the dependencies with `pnpm install`.

<h3>Build for Chrome</h3>

```bash
 pnpm run build:chrome
```

<h3>Build for Firefox</h3>

```bash
 pnpm run build:firefox
```
