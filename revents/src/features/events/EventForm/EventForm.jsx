/* global google */
import React, { useState, useEffect } from "react"

import { connect } from "react-redux"
import { reduxForm, Field } from "redux-form"
import { withFirestore } from "react-redux-firebase"
import { geocodeByAddress, getLatLng } from "react-places-autocomplete"
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react"
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan,
} from "revalidate"

import { createEvent, updateEvent, cancelToggle } from "../eventActions"
import TextInput from "../../../app/common/form/TextInput"
import PlaceInput from "../../../app/common/form/PlaceInput"
import TextArea from "../../../app/common/form/TextArea"
import SelectInput from "../../../app/common/form/SelectInput"
import DateInput from "../../../app/common/form/DateInput"

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id

  let event = {}

  const { events } = state.firestore.ordered

  if (events && events.length > 0) {
    event = events.filter(event => event.id === eventId)[0] || {}
  }

  return {
    initialValues: event,
    event,
    loading: state.async.loading,
  }
}

const actions = {
  createEvent,
  updateEvent,
  cancelToggle,
}

const validate = combineValidators({
  title: isRequired({ message: "The event title is required" }),
  category: isRequired({ message: "The event category is required" }),
  description: composeValidators(
    isRequired({ message: "Please enter a description" }),
    hasLengthGreaterThan(4)({
      message: "Description needs to be at least 5 characters",
    }),
  )(),
  city: isRequired("city"),
  venue: isRequired("venue"),
  date: isRequired("date"),
})

const category = [
  { key: "drinks", text: "Drinks", value: "drinks" },
  { key: "culture", text: "Culture", value: "culture" },
  { key: "film", text: "Film", value: "film" },
  { key: "food", text: "Food", value: "food" },
  { key: "music", text: "Music", value: "music" },
  { key: "travel", text: "Travel", value: "travel" },
]

const EventForm = ({
  history,
  initialValues,
  invalid,
  submitting,
  pristine,
  updateEvent,
  createEvent,
  cancelToggle,
  change,
  handleSubmit,
  firestore,
  match,
  event,
  loading,
}) => {
  const [cityLatLng, setCityLatLng] = useState({})
  const [venueLatLng, setVenueLatLng] = useState({})

  useEffect(() => {
    const fetchEvent = async () => {
      // A better idea than using firestore.setListener directly would be to use the
      // firestoreConnect HOC. We are only doing it this way to practice different ways
      // of doing the same thing.
      //
      // Here, we have to manually handle the cleanup.
      await firestore.setListener(`events/${match.params.id}`)
    }
    fetchEvent()

    const cleanup = async () => {
      await firestore.unsetListener(`events/${match.params.id}`)
    }
    return cleanup
  }, [firestore, match.params.id, history])

  const onFormSubmit = async values => {
    values.venueLatLng = venueLatLng
    try {
      if (initialValues.id) {
        if (Object.keys(values.venueLatLng).length === 0)
          values.venueLatLng = event.venueLatLng

        await updateEvent(values)
        history.push(`/events/${initialValues.id}`)
      } else {
        let createdEvent = await createEvent(values)
        history.push(`/events/${createdEvent.id}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => setCityLatLng(latlng))
      .then(() => {
        change("city", selectedCity)
      })
  }

  const handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => setVenueLatLng(latlng))
      .then(() => {
        change("venue", selectedVenue)
      })
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment>
          <Header sub color="teal" content="Event Details" />
          <Form onSubmit={handleSubmit(onFormSubmit)} autoComplete="off">
            <Field
              name="title"
              component={TextInput}
              placeholder="Give your event a name"
            />
            <Field
              name="category"
              options={category}
              component={SelectInput}
              placeholder="What is your event about?"
            />
            <Field
              name="description"
              component={TextArea}
              rows={3}
              placeholder="Event Tell us about your event"
            />
            <Header sub color="teal" content="Event Location Details" />
            <Field
              name="city"
              component={PlaceInput}
              options={{ types: ["(cities)"] }}
              onSelect={handleCitySelect}
              placeholder="Event City"
            />
            <Field
              name="venue"
              component={PlaceInput}
              options={{
                location: new google.maps.LatLng(cityLatLng),
                radius: 1000,
                types: ["establishment"],
              }}
              onSelect={handleVenueSelect}
              placeholder="Event Venue"
            />
            <Field
              name="date"
              component={DateInput}
              dateFormat="dd LLL yyyy h:mm a"
              showTimeSelect
              timeFormat="HH:mm"
              placeholder="Event Date"
            />

            <Button
              loading={loading}
              disabled={invalid || submitting || pristine}
              positive
              type="submit"
            >
              Submit
            </Button>
            <Button
              onClick={
                initialValues.id
                  ? () => history.push(`/events/${initialValues.id}`)
                  : () => history.push("/events")
              }
              type="button"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              color={event.cancelled ? "green" : "red"}
              floated="right"
              content={event.cancelled ? "Reactivate event" : "Cancel event"}
              onClick={() => cancelToggle(!event.cancelled, event.id)}
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default withFirestore(
  connect(
    mapState,
    actions,
  )(
    reduxForm({ form: "eventForm", validate, enableReinitialize: true })(
      EventForm,
    ),
  ),
)
