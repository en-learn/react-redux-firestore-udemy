import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Grid } from "semantic-ui-react"
import { withFirestore } from "react-redux-firebase"

import { objectToArray } from "../../../app/common/util/helpers"
import EventDetailedHeader from "./EventDetailedHeader"
import EventDetailedInfo from "./EventDetailedInfo"
import EventDetailedChat from "./EventDetailedChat"
import EventDetailedSidebar from "./EventDetailedSidebar"
import { goingToEvent } from "../../user/userActions"

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id

  let event = {}

  const { events } = state.firestore.ordered

  if (events && events.length > 0) {
    event = events.filter(event => event.id === eventId)[0] || {}
  }

  return {
    event,
    auth: state.firebase.auth,
  }
}

const actions = {
  goingToEvent,
}

const EventDetailedPage = ({ event, firestore, match, auth, goingToEvent }) => {
  useEffect(() => {
    const fetchEvent = async () => {
      await firestore.setListener(`events/${match.params.id}`)
    }
    fetchEvent()

    const cleanup = async () => {
      await firestore.unsetListener(`events/${match.params.id}`)
    }
    return cleanup
  }, [firestore, match.params.id])

  const attendees = event && event.attendees && objectToArray(event.attendees)
  const isHost = event.hostUid === auth.uid
  const isGoing = attendees && attendees.some(a => a.id === auth.uid)

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader
          event={event}
          isGoing={isGoing}
          isHost={isHost}
          goingToEvent={goingToEvent}
        />
        <EventDetailedInfo event={event} />
        <EventDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar attendees={attendees} />
      </Grid.Column>
    </Grid>
  )
}

export default withFirestore(connect(mapState, actions)(EventDetailedPage))
