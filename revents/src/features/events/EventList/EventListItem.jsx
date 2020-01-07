import React from "react"
import { Segment, Item, Icon, List, Button, Label } from "semantic-ui-react"
import { Link } from "react-router-dom"
import EventListAttendee from "./EventListAttendee"
import { format } from "date-fns"

const EventListItem = ({ event }) => (
  <Segment.Group>
    <Segment>
      <Item.Group>
        <Item>
          <Item.Image size="tiny" circular src={event.hostPhotoURL} />
          <Item.Content>
            <Item.Header>{event.title}</Item.Header>
            <Item.Description>Hosted by {event.hostedBy}</Item.Description>
            {event.cancelled && (
              <Label
                style={{ top: "-40px" }}
                ribbon="right"
                color="red"
                content="This event has been cancelled"
              />
            )}
          </Item.Content>
        </Item>
      </Item.Group>
    </Segment>
    <Segment>
      <span>
        <Icon name="clock" /> {format(event.date.toDate(), "EEEE do LLL")} at{" "}
        {format(event.date.toDate(), "h:mm a")} |
        <Icon name="marker" /> {event.venue}
      </span>
    </Segment>
    <Segment secondary>
      <List horizontal>
        {event.attendees &&
          Object.values(event.attendees).map((attendee, index) => (
            <EventListAttendee key={index} attendee={attendee} />
          ))}
      </List>
    </Segment>
    <Segment clearing>
      <span>{event.description}</span>
      <br />
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

export default EventListItem
