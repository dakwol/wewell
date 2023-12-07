import Auth from "../components/screens/Auth/Auth";
import Home from "../components/screens/Home/Home";
import Profile from "../components/screens/Profile/Profile";
import { IRoute } from "./navigation.types";

export const routes: IRoute[] = [
    {
        name: "Auth",
        component: Auth
    },
    {
        name: "Home",
        component: Home
    },
    {
        name: "Profile",
        component: Profile
    },
]