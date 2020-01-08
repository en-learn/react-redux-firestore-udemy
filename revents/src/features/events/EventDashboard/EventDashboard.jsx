import React, { useEffect, useState } from "react"
import { Grid, Button } from "semantic-ui-react"
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
  const [moreEvents, setMoreEvents] = useState(false)

  useEffect(() => {
    async function getEvents() {
      let next = await getEventsForDashboard()
      console.log(next)

      if (next && next.docs && next.docs.length > 1) {
        setMoreEvents(true)
      }
    }
    getEvents()
  }, [getEventsForDashboard])

  const getNextEvents = async () => {
    let lastEvent = events && events[events.length - 1]
    console.log(lastEvent)
    let next = await getEventsForDashboard(lastEvent)
    console.log(next)
    if (next && next.docs && next.docs.length <= 1) {
      setMoreEvents(false)
    }
  }

  if (loading) return <LoadingComponent />
  return (
    <Grid>
      <Grid.Column width={10}>
        <EventList events={events} />
        <Button
          onClick={getNextEvents}
          disabled={!moreEvents}
          content="More"
          color="green"
          floated="right"
        />
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
