import React, { Component } from "react";
import EventListItem from "./EventListItem";

class EventList extends Component {
  render() {
    return (
      <>
        <EventListItem />
        <EventListItem />
        <EventListItem />
      </>
    );
  }
}
export default EventList;
