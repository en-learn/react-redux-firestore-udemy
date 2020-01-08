import React from "react"
import { Grid } from "semantic-ui-react"
import { connect } from "react-redux"
import { firestoreConnect, isLoaded } from "react-redux-firebase"
import EventList from "../EventList/EventList"
import { createEvent, updateEvent } from "../eventActions"
import LoadingComponent from "../../../app/layout/LoadingComponent"
import EventActivity from "../EventActivity/EventActivity"

const mapState = state => ({
  events: state.firestore.ordered.events,
})

const actions = {
  createEvent,
  updateEvent,
}

const EventDashboard = ({ events }) => {
  if (!isLoaded(events)) return <LoadingComponent />
  return (
    <Grid>
      <Grid.Column width={10}>
        <EventList events={events} />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventActivity />
      </Grid.Column>
    </Grid>
  )
}

export default connect(
  mapState,
  actions,
)(firestoreConnect([{ collection: "events" }])(EventDashboard))
