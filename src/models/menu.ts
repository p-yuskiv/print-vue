export interface IMenuItem {
    to: string;
    description?: string;
    caption: string;
}

export interface IMenu {
    menuTitle?: string;
    menuItems: IMenuItem[];
}
