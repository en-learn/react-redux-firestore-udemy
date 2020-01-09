import React from "react"
import { Form, Button } from "semantic-ui-react"
import { Field, reduxForm } from "redux-form"
import TextArea from "../../../app/common/form/TextArea"

const EventDetailedChatForm = ({
  addEventComment,
  eventId,
  reset,
  handleSubmit,
  closeForm,
}) => {
  const handleCommentSubmit = values => {
    addEventComment(eventId, values)
    reset()
    closeForm()
  }
  return (
    <Form onSubmit={handleSubmit(handleCommentSubmit)}>
      <Field name="comment" type="text" component={TextArea} rows={2} />
      <Button content="Add Reply" labelPosition="left" icon="edit" primary />
    </Form>
  )
}

export default reduxForm({ Fields: "comment" })(EventDetailedChatForm)
