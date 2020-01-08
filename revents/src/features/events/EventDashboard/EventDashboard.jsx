import React, { useEffect } from "react"
import { Grid } from "semantic-ui-react"
import { connect } from "react-redux"
import { firestoreConnect } from "react-redux-firebase"
import EventList from "../EventList/EventList"
import { getEventsForDashboard } from "../eventActions"
import LoadingComponent from "../../../app/layout/LoadingComponent"
import EventActivity from "../EventActivity/EventActivity"

const mapState = state => ({
  events: state.events,
  loading: state.async.loading,
})

const actions = {
  getEventsForDashboard,
}

const EventDashboard = ({ events, getEventsForDashboard, loading }) => {
  useEffect(() => {
    getEventsForDashboard()
  }, [getEventsForDashboard])

  if (loading) return <LoadingComponent />
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
