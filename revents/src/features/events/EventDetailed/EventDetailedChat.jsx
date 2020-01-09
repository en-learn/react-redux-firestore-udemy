import React, { useState } from "react"
import { Segment, Comment, Header } from "semantic-ui-react"
import EventDetailedChatForm from "./EventDetailedChatForm"
import { Link } from "react-router-dom"
import { formatDistance } from "date-fns"

const EventDetailedChat = ({ addEventComment, eventId, eventChat }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const handleOpenReplyForm = () => {
    setShowReplyForm(true)
  }

  const handleCloseReplyForm = () => {
    setShowReplyForm(false)
  }

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>

      <Segment attached>
        <Comment.Group>
          {eventChat &&
            eventChat.map(comment => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.photoURL || "/assets/user.png"} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.uid}`}>
                    {comment.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistance(comment.date, Date.now())}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.text}</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action onClick={handleOpenReplyForm}>
                      Reply
                    </Comment.Action>
                    {showReplyForm && (
                      <EventDetailedChatForm
                        addEventComment={addEventComment}
                        eventId={eventId}
                      />
                    )}
                  </Comment.Actions>
                </Comment.Content>
              </Comment>
            ))}
        </Comment.Group>
        <EventDetailedChatForm
          addEventComment={addEventComment}
          eventId={eventId}
        />
      </Segment>
    </>
  )
}

export default EventDetailedChat
