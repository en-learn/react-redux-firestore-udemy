import React, { useEffect, useState, useRef } from "react"
import { Grid, Loader } from "semantic-ui-react"
import { connect } from "react-redux"
import { firestoreConnect } from "react-redux-firebase"
import EventList from "../EventList/EventList"
import { getEventsForDashboard } from "../eventActions"
import LoadingComponent from "../../../app/layout/LoadingComponent"
import EventActivity from "../EventActivity/EventActivity"

const query = [
  {
    collection: "activity",
    orderBy: ["timestamp", "desc"],
    limit: 5,
  },
]

const mapState = state => ({
  events: state.events,
  loading: state.async.loading,
  activities: state.firestore.ordered.activity,
})

const actions = {
  getEventsForDashboard,
}

const EventDashboard = ({
  events,
  getEventsForDashboard,
  loading,
  activities,
}) => {
  const contextRef = useRef(null)

  const [moreEvents, setMoreEvents] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadedEvents, setLoadedEvents] = useState([])

  const didMountRef = useRef(false)

  useEffect(() => {
    async function getEvents() {
      let next = await getEventsForDashboard()

      if (next && next.docs && next.docs.length > 1) {
        setMoreEvents(true)
        setLoadingInitial(false)
      }
    }
    getEvents()
  }, [getEventsForDashboard])

  useEffect(() => {
    if (didMountRef.current) {
      setLoadedEvents(previousEvents => [...previousEvents, ...events])
    } else didMountRef.current = true
  }, [events])

  const getNextEvents = async () => {
    let lastEvent = events && events[events.length - 1]
    let next = await getEventsForDashboard(lastEvent)
    if (next && next.docs && next.docs.length <= 1) {
      setMoreEvents(false)
    }
  }

  if (loadingInitial) return <LoadingComponent />

  return (
    <Grid>
      <Grid.Column width={10}>
        <div ref={contextRef}>
          <EventList
            events={loadedEvents}
            getNextEvents={getNextEvents}
            loading={loading}
            moreEvents={moreEvents}
          />
        </div>
      </Grid.Column>
      <Grid.Column width={6}>
        <EventActivity activities={activities} contextRef={contextRef} />
      </Grid.Column>
      <Grid.Column width={10}>
        {" "}
        <Loader active={loading} />{" "}
      </Grid.Column>
    </Grid>
  )
}

export default connect(
  mapState,
  actions,
)(firestoreConnect(query)(EventDashboard))
