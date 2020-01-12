import React, { Component } from "react"
import EventDashboard from "../../features/events/EventDashboard/EventDashboard"
import NavBar from "../../features/nav/NavBar/NavBar"
import { Container } from "semantic-ui-react"
import { Route, Switch, withRouter } from "react-router-dom"
import HomePage from "../../features/home/HomePage"
import EventDetailedPage from "../../features/events/EventDetailed/EventDetailedPage"
import PeopleDashboard from "../../features/user/PeopleDashboard/PeopleDashboard"
import UserDetailedPage from "../../features/user/UserDetailed/UserDetailedPage"
import SettingsDashboard from "../../features/user/Settings/SettingsDashboard"
import EventsForm from "../../features/events/EventForm/EventForm"
import TestComponent from "../../features/testarea/TestComponent"
import ModalManager from "../../features/modals/ModalManager"
import NotFound from "./NotFound"
import { UserIsAuthenticated } from "../../features/auth/authWrapper"

const routes = props => {
  return (
    <>
      <NavBar />
      <Container className="main">
        <Switch key={props.location.key}>
          <Route exact path="/events" component={EventDashboard} />
          <Route path="/events/:id" component={EventDetailedPage} />
          <Route
            exact
            path="/people"
            component={UserIsAuthenticated(PeopleDashboard)}
          />
          <Route
            path="/profile/:id"
            component={UserIsAuthenticated(UserDetailedPage)}
          />
          <Route
            path="/settings"
            component={UserIsAuthenticated(SettingsDashboard)}
          />
          <Route
            path={["/createEvent", "/manage/:id"]}
            component={UserIsAuthenticated(EventsForm)}
          />
          <Route path="/test" component={TestComponent} />
          <Route component={NotFound} />
        </Switch>{" "}
      </Container>
    </>
  )
}

class App extends Component {
  render() {
    return (
      <>
        <ModalManager />
        <Route path="/" exact component={HomePage} />
        <Route path="/(.+)" render={() => routes(this.props)} />
      </>
    )
  }
}

export default withRouter(App)
