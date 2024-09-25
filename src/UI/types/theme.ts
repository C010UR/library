export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

export class Theme {
  private theme: ThemeEnum = ThemeEnum.LIGHT;

  constructor() {
    if (!('dark-mode' in localStorage)) {
      this.setDefaultTheme();
    } else if (localStorage['dark-mode'] === 'true') {
      this.enableDarkMode();
    } else if (localStorage['dark-mode'] === 'false') {
      this.disableDarkMode();
    }
  }

  public toggleTheme() {
    this.setTheme(
      this.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK,
    );
  }

  public setTheme(theme: ThemeEnum | undefined) {
    switch (theme) {
      case ThemeEnum.DARK:
        this.enableDarkMode();
        break;
      case ThemeEnum.LIGHT:
        this.disableDarkMode();
        break;
      default:
        this.setDefaultTheme();
    }
  }

  public getTheme() {
    return this.theme;
  }

  private setDefaultTheme() {
    const isDark: boolean = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    localStorage.setItem('dark-mode', isDark ? 'true' : 'false');
    if (isDark) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }

    this.theme = isDark ? ThemeEnum.DARK : ThemeEnum.LIGHT;
  }

  private enableDarkMode() {
    document.documentElement.classList.add('dark');
    localStorage.setItem('dark-mode', 'true');

    this.theme = ThemeEnum.DARK;
  }

  private disableDarkMode() {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('dark-mode', 'false');

    this.theme = ThemeEnum.LIGHT;
  }
}
