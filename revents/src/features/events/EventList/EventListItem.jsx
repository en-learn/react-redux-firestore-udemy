import React, { Component } from "react"
import { Segment, Item, Icon, List, Button } from "semantic-ui-react"
import { Link } from "react-router-dom"
import EventListAttendee from "./EventListAttendee"
import { format, parseISO } from "date-fns"

class EventListItem extends Component {
  render() {
    const { event, deleteEvent } = this.props
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header>{event.title}</Item.Header>
                <Item.Description>Hosted by {event.hostedBy}</Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" /> {format(parseISO(event.date), "EEEE do LLL")}{" "}
            at {format(parseISO(event.date), "h:mm a")} |
            <Icon name="marker" /> {event.venue}
          </span>
        </Segment>
        <Segment secondary>
          <List horizontal>
            {event.attendees &&
              event.attendees.map(attendee => (
                <EventListAttendee key={attendee.id} attendee={attendee} />
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <span>{event.description}</span>
          <br />
          <Button
            as="a"
            color="red"
            floated="right"
            content="Delete"
            onClick={() => deleteEvent(event.id)}
          />
          <Button
            as={Link}
            to={`/events/${event.id}`}
            color="teal"
            floated="right"
            content="View"
          />
        </Segment>
      </Segment.Group>
    )
  }
}
export default EventListItem
