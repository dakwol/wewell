import { ComponentType } from "react";

export type TypeRootrStackParamList = {
    Onboarding: undefined;
    Auth: undefined;
    AuthSms: undefined;
    AuthName: undefined;
    AuthCategory: undefined;
    Home: undefined;
    Invite: undefined;
    Profile: undefined;
}

export interface IRoute {
    name: keyof TypeRootrStackParamList
    component: ComponentType;
}