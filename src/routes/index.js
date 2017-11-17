/**
 * Created by Cray on 2017/7/11.
 */
import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {asyncComponent} from '~lib/async-component';
import { userIsAuthenticatedRedir, userIsNotAuthenticatedRedir } from '~common/auth'
import HomeComponent from '~pages/home';
import ToolComponent from '~pages/tool';
import DevTools from '~components/devtools'

const DatabaseComponent = asyncComponent(() => import("~pages/home/pm/databases"));
const ProjectComponent = asyncComponent(() => import("~pages/home/pm/projects"));
const UserComponent = asyncComponent(() => import("~pages/home/user/index.js"));
const UserRegisterComponent = asyncComponent(() => import("~pages/home/user/register.js"));
const UserManagerComponent = asyncComponent(() => import("~pages/home/user/manager.js"));
const NewsComponent = asyncComponent(() => import("~pages/home/news"));
const LoginComponent = asyncComponent(() => import("~pages/signin"));
const ApiListComponent = asyncComponent(() => import("~pages/project/api/list"));

const ApiDetailsComponent = asyncComponent(() => import("~pages/project/api/details"));
const ApiEditComponent = asyncComponent(() => import("~pages/project/api/edit"));
const ApiTestComponent = asyncComponent(() => import("~pages/project/api/test"));
const ApiPTestComponent = asyncComponent(() => import("~pages/project/api/ptest"));
const CodeListComponent = asyncComponent(() => import("~pages/project/code/list"));
const CodeEditComponent = asyncComponent(() => import("~pages/project/code/edit"));
const CodeDetailsComponent = asyncComponent(() => import("~pages/project/code/details"));
const databaseListComponent = asyncComponent(() => import("~pages/database/list"));
const ITempleteEditComponent = asyncComponent(() => import("~pages/project/itemplete/edit"));

const JsonComponent = asyncComponent(() => import("~pages/tool/json"));
const Md5Component = asyncComponent(() => import("~pages/tool/md5"));
const Base64Component = asyncComponent(() => import("~pages/tool/base64"));
const QRcodeComponent = asyncComponent(() => import("~pages/tool/qrcode"));
const HttpComponent = asyncComponent(() => import("~pages/tool/http"));

const Home = userIsAuthenticatedRedir(HomeComponent);
const Tool = userIsAuthenticatedRedir(ToolComponent);
const Database = userIsAuthenticatedRedir(DatabaseComponent);
const Project = userIsAuthenticatedRedir(ProjectComponent);
const User = userIsAuthenticatedRedir(UserComponent);
const UserRegister = userIsAuthenticatedRedir(UserRegisterComponent);
const UserManager = userIsAuthenticatedRedir(UserManagerComponent);
const News = userIsAuthenticatedRedir(NewsComponent);
const Login = userIsNotAuthenticatedRedir(LoginComponent);
const ApiList = userIsAuthenticatedRedir(ApiListComponent);
const ApiDetails = userIsAuthenticatedRedir(ApiDetailsComponent);
const ApiEdits = userIsAuthenticatedRedir(ApiEditComponent);
const ApiTests = userIsAuthenticatedRedir(ApiTestComponent);
const ApiPtests = userIsAuthenticatedRedir(ApiPTestComponent);
const Code = userIsAuthenticatedRedir(CodeListComponent);
const CodeEdit = userIsAuthenticatedRedir(CodeEditComponent);
const CodeDetails = userIsAuthenticatedRedir(CodeDetailsComponent);
const databaseList = userIsAuthenticatedRedir(databaseListComponent);
const ITempleteEdit = userIsAuthenticatedRedir(ITempleteEditComponent);
const Json = userIsAuthenticatedRedir(JsonComponent);
const Md5 = userIsAuthenticatedRedir(Md5Component);
const Base64 = userIsAuthenticatedRedir(Base64Component);
const QRcode = userIsAuthenticatedRedir(QRcodeComponent);
const Http = userIsAuthenticatedRedir(HttpComponent);

const NoMatch = ({location}) => (
    <div>
        <h3>无法匹配 <code>{location.pathname}</code></h3>
    </div>
);
/**
 * 导出路由
 * @type {XML}
 */
export const routes = (
    <Route render={({location}) => {
        return (
            <div key={location.pathname}>
                <Switch>
                    <Route location={location}  exact path="/" component={Home}/>
                    <Route location={location}  exact path="/home" component={Home}/>
                    <Route location={location}  exact path="/tool" component={Tool}/>
                    <Route location={location}  exact path="/home/news" component={News}/>
                    <Route location={location}  exact path="/home/user" component={User}/>
                    <Route location={location}  exact path="/home/user/manager" component={UserManager}/>
                    <Route location={location}  exact path="/home/user/register" component={UserRegister}/>
                    <Route location={location}  exact path="/home/pm/project" component={Project}/>
                    <Route location={location}  exact path="/home/pm/databases" component={Database}/>
                    <Route location={location}  exact path="/project/api/list" component={ApiList}/>
                    <Route location={location}  exact path="/project/api/details" component={ApiDetails}/>
                    <Route location={location}  exact path="/project/api/edit" component={ApiEdits}/>
                    <Route location={location}  exact path="/project/api/test" component={ApiTests}/>
                    <Route location={location}  exact path="/project/api/ptest" component={ApiPtests}/>
                    <Route location={location}  exact path="/project/code/list" component={Code}/>
                    <Route location={location}  exact path="/project/code/edit" component={CodeEdit}/>
                    <Route location={location}  exact path="/project/code/details" component={CodeDetails}/>
                    <Route location={location}  exact path="/project/itemplete/edit" component={ITempleteEdit}/>
                    <Route location={location}  exact path="/database/list" component={databaseList}/>
                    <Route location={location}  path="/login" component={Login}/>
                    <Route location={location}  path="/tool/json" component={Json}/>
                    <Route location={location}  path="/tool/md5" component={Md5}/>
                    <Route location={location}  path="/tool/base64" component={Base64}/>
                    <Route location={location}  path="/tool/qrcode" component={QRcode}/>
                    <Route location={location}  path="/tool/http" component={Http}/>
                    <Route component={NoMatch}/>
                </Switch>
                {/*<DevTools/>*/}
            </div>
        )
    }}/>
)



