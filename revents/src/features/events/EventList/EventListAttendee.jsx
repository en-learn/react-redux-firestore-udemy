import React from "react"
import { List, Image } from "semantic-ui-react"
import { Link } from "react-router-dom"

const EventListAttendee = ({ attendee }) => (
  <List.Item>
    <Image
      as={Link}
      to={`/profile/${attendee.id}`}
      size="mini"
      circular
      src={attendee.photoURL}
    />
  </List.Item>
)

export default EventListAttendee
