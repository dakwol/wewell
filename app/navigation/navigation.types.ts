import { ComponentType } from "react";

export type TypeRootrStackParamList = {
    Onboarding: undefined;
    Transition: undefined;
    Auth: undefined;
    AuthRegistration: undefined;
    AuthSms: undefined;
    AuthName: undefined;
    AuthCategory: undefined;
    Home: undefined;
    Invite: undefined;
    Profile: undefined;
    ProfileMeeting: undefined;
}

export interface IRoute {
    name: keyof TypeRootrStackParamList
    component: ComponentType;
}