export interface INavItem {
    name: string;
    url: string ;
    icon: string;
    active: boolean;
    children: INavItem[];
}
