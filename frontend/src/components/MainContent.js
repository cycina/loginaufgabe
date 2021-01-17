import React from "react";
import { Switch, Route } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";
import NotRequireAuth from "./auth/NotRequireAuth";
import Landing from "./Landing";
import Login from "./auth/Login";
import Logout from "./auth/Logout";
import Signup from "./auth/Signup";
import UserProfile from "./auth/UserProfile";
import PageNotFound from "./PageNotFound";

const MainContent = () => (
    <div>
        <Switch>
            <Route exact path="/" component={Landing}/>
            <Route path="/login" component={NotRequireAuth(Login)}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/signup" component={NotRequireAuth(Signup)}/>
            <Route path="/profile" component={RequireAuth(UserProfile)}/>
            <Route component={PageNotFound}/>
        </Switch>
    </div>
);

export default MainContent;
