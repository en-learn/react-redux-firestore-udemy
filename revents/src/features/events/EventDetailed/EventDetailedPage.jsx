import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Grid } from "semantic-ui-react"
import { withFirestore } from "react-redux-firebase"
import { toastr } from "react-redux-toastr"

import EventDetailedHeader from "./EventDetailedHeader"
import EventDetailedInfo from "./EventDetailedInfo"
import EventDetailedChat from "./EventDetailedChat"
import EventDetailedSidebar from "./EventDetailedSidebar"

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id

  let event = {}

  const { events } = state.firestore.ordered

  if (events && events.length > 0) {
    event = events.filter(event => event.id === eventId)[0]
  }

  return {
    event,
  }
}

const EventDetailedPage = ({ event, firestore, match, history }) => {
  useEffect(() => {
    const fetchEvent = async () => {
      const event = await firestore.get(`events/${match.params.id}`)
      if (!event.exists) {
        history.push("/events")
        toastr.error("Sorry", "Event not found")
      }
    }
    fetchEvent()
  }, [firestore, match.params.id, history])

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader event={event} />
        <EventDetailedInfo event={event} />
        <EventDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar attendees={event.attendees} />
      </Grid.Column>
    </Grid>
  )
}

export default withFirestore(connect(mapState)(EventDetailedPage))
