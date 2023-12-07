import { ComponentType } from "react";

export type TypeRootrStackParamList = {
    Auth: undefined;
    Home: undefined;
    Profile: undefined;
}

export interface IRoute {
    name: keyof TypeRootrStackParamList
    component: ComponentType;
}