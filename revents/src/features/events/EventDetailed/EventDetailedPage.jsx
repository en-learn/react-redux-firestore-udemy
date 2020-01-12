import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Grid } from "semantic-ui-react"
import { withFirestore, firebaseConnect, isEmpty } from "react-redux-firebase"
import { compose } from "redux"
import { objectToArray, createDataTree } from "../../../app/common/util/helpers"
import EventDetailedHeader from "./EventDetailedHeader"
import EventDetailedInfo from "./EventDetailedInfo"
import EventDetailedChat from "./EventDetailedChat"
import EventDetailedSidebar from "./EventDetailedSidebar"
import { goingToEvent, cancelGoingToEvent } from "../../user/userActions"
import { addEventComment } from "../eventActions"
import { openModal } from "../../modals/modalActions"
import LoadingComponent from "../../../app/layout/LoadingComponent"
import NotFound from "../../../app/layout/NotFound"

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id

  let event = {}

  const { events } = state.firestore.ordered

  if (events && events.length > 0) {
    event = events.filter(event => event.id === eventId)[0] || {}
  }

  return {
    event,
    requesting: state.firestore.status.requesting,
    auth: state.firebase.auth,
    loading: state.async.loading,
    eventChat:
      !isEmpty(state.firebase.data.event_chat) &&
      objectToArray(state.firebase.data.event_chat[ownProps.match.params.id]),
  }
}

const actions = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
  openModal,
}

const EventDetailedPage = ({
  event,
  firestore,
  match,
  auth,
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
  eventChat,
  loading,
  requesting,
  openModal,
}) => {
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
  const chatTree = !isEmpty(eventChat) && createDataTree(eventChat)
  const authenticated = auth.isLoaded && !auth.isEmpty
  const loadingEvent = requesting[`events/${match.params.id}`]

  if (loadingEvent) return <LoadingComponent />

  if (Object.keys(event).length === 0) return <NotFound />

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader
          event={event}
          isGoing={isGoing}
          isHost={isHost}
          goingToEvent={goingToEvent}
          cancelGoingToEvent={cancelGoingToEvent}
          loading={loading}
          authenticated={authenticated}
          openModal={openModal}
        />
        <EventDetailedInfo event={event} />
        {authenticated && (
          <EventDetailedChat
            eventChat={chatTree}
            addEventComment={addEventComment}
            eventId={event.id}
          />
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar attendees={attendees} />
      </Grid.Column>
    </Grid>
  )
}

export default compose(
  withFirestore,
  connect(mapState, actions),
  firebaseConnect(props => [`event_chat/${props.match.params.id}`]),
)(EventDetailedPage)
