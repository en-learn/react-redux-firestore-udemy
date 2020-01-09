import React from "react"
import EventListItem from "./EventListItem"
import InfiniteScroll from "react-infinite-scroller"

const EventList = ({ events, getNextEvents, loading, moreEvents }) => (
  <>
    {events && events.length !== 0 && (
      <InfiniteScroll
        pageStart={0}
        loadMore={getNextEvents}
        hasMore={!loading && moreEvents}
        initialLoad={false}
      >
        {events &&
          events.map(event => <EventListItem key={event.id} event={event} />)}
      </InfiniteScroll>
    )}
  </>
)

export default EventList
