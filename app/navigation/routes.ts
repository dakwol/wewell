import Onboarding from "@/components/screens/Onboarding/Onboarding";
import Auth from "../components/screens/Auth/Auth";
import Home from "../components/screens/Home/Home";
import Invite from "../components/screens/Invite/Invite";
import Profile from "../components/screens/Profile/Profile";
import { IRoute } from "./navigation.types";
import AuthSms from "@/components/screens/AuthSMS/AuthSMS";
import AuthName from "@/components/screens/AuthName/AuthName";
import AuthCategory from "@/components/screens/AuthCategory/AuthCategory";
import Transition from "@/components/screens/TransitionScreen/TranstitionScreen";
import ProfileMeeting from "@/components/screens/ProfileMeeting/ProfileMeeting";
import AuthRegistration from "@/components/screens/AuthRegistration/AuthRegistration";

export const routes: IRoute[] = [
    {
        name: "Onboarding",
        component: Onboarding
    },
    {
        name: "Auth",
        component: Auth
    },
    {
        name: "AuthRegistration",
        component: AuthRegistration
    },
    {
        name: "AuthSms",
        component: AuthSms
    },
    {
        name: "AuthName",
        component: AuthName
    },
    {
        name: "AuthCategory",
        component: AuthCategory
    },
    {
        name: "Home",
        component: Home
    },
    {
        name: "Invite",
        component: Invite
    },
    {
        name: "Profile",
        component: Profile
    },
    {
        name: "ProfileMeeting",
        component: ProfileMeeting
    },
]