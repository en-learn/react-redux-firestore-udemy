import React from "react"
import EventListItem from "./EventListItem"

const EventList = ({ events }) => (
  <>
    {events &&
      events.map(event => <EventListItem key={event.id} event={event} />)}
  </>
)

export default EventList
