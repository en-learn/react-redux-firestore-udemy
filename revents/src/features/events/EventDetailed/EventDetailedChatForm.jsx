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
  parentId,
}) => {
  const handleCommentSubmit = values => {
    addEventComment(eventId, values, parentId)
    reset()
    if (parentId !== 0) closeForm()
  }
  return (
    <Form onSubmit={handleSubmit(handleCommentSubmit)}>
      <Field name="comment" type="text" component={TextArea} rows={2} />
      <Button content="Add Reply" labelPosition="left" icon="edit" primary />
    </Form>
  )
}

export default reduxForm({ Fields: "comment" })(EventDetailedChatForm)
