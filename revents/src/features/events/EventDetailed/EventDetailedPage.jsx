import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Grid } from "semantic-ui-react"
import { withFirestore } from "react-redux-firebase"

import EventDetailedHeader from "./EventDetailedHeader"
import EventDetailedInfo from "./EventDetailedInfo"
import EventDetailedChat from "./EventDetailedChat"
import EventDetailedSidebar from "./EventDetailedSidebar"

const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.match.params.id

  let event = {}

  if (eventId && state.events.length > 0) {
    event = state.events.filter(event => event.id === eventId)[0]
  }

  return {
    event,
  }
}

const EventDetailedPage = ({ firestore, match }) => {
  useEffect(() => {
    const fetchEvent = async () => {
      const event = await firestore.get(`events/${match.params.id}`)
      console.log(event)
    }
    fetchEvent()
  }, [firestore, match.params.id])

  return (
    <Grid>
      <Grid.Column width={10}>
        {/* <EventDetailedHeader event={event} /> */}
        {/* <EventDetailedInfo event={event} /> */}
        <EventDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        {/* <EventDetailedSidebar attendees={event.attendees} /> */}
      </Grid.Column>
    </Grid>
  )
}

export default withFirestore(connect(mapStateToProps)(EventDetailedPage))
