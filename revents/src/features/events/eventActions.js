import { FETCH_EVENTS } from "./eventConstants"
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from "../async/asyncActions"
import { toastr } from "react-redux-toastr"
import { createNewEvent } from "../../app/common/util/helpers"
import firebase from "../../app/config/firebase"

export const createEvent = event => {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    dispatch(asyncActionStart())
    const firestore = getFirestore()
    const firebase = getFirebase()
    const user = firebase.auth().currentUser
    const photoURL = getState().firebase.profile.photoURL
    const newEvent = createNewEvent(user, photoURL, event)

    try {
      let createdEvent = await firestore.add("events", newEvent)
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true,
      })
      toastr.success("Success!", "Event has been created")
      dispatch(asyncActionFinish())
      return createdEvent
    } catch (error) {
      dispatch(asyncActionError())
      toastr.error("Oops", "Something went wrong")
    }
  }
}

export const updateEvent = event => {
  return async (dispatch, getState, { getFirestore }) => {
    dispatch(asyncActionStart())
    const firestore = getFirestore()
    try {
      await firestore.update(`events/${event.id}`, event)
      dispatch(asyncActionFinish())
      toastr.success("Success!", "Event has been updated")
    } catch (error) {
      dispatch(asyncActionError())
      toastr.error("Oops", "Something went wrong")
    }
  }
}

export const cancelToggle = (cancelled, eventId) => async (
  dispatch,
  getState,
  { getFirestore },
) => {
  const firestore = getFirestore()
  const message = cancelled
    ? "Are you sure you want to cancel the event?"
    : "This will reactivate the event, are you sure?"
  try {
    toastr.confirm(message, {
      onOk: async () =>
        await firestore.update(`events/${eventId}`, {
          cancelled,
        }),
    })
  } catch (error) {
    console.log(error)
  }
}

export const getEventsForDashboard = lastEvent => async (
  dispatch,
  getState,
) => {
  let today = new Date()
  const firestore = firebase.firestore()
  const eventsRef = firestore.collection("events")
  try {
    dispatch(asyncActionStart())
    let startAfter =
      lastEvent &&
      (await firestore
        .collection("events")
        .doc(lastEvent.id)
        .get())
    let query

    lastEvent
      ? (query = eventsRef
          .where("date", ">=", today)
          .orderBy("date")
          .startAfter(startAfter)
          .limit(2))
      : (query = eventsRef
          .where("date", ">=", today)
          .orderBy("date")
          .limit(2))

    let querySnap = await query.get()

    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish())
      return querySnap
    }

    let events = []

    for (let snap of querySnap.docs) {
      let event = { ...snap.data(), id: snap.id }
      events.push(event)
    }

    dispatch({ type: FETCH_EVENTS, payload: { events } })
    dispatch(asyncActionFinish())
    return querySnap
  } catch (error) {
    console.log(error)
    dispatch(asyncActionError())
  }
}

export const addEventComment = (eventId, { comment }, parentId) => async (
  dispatch,
  getState,
  { getFirebase },
) => {
  const firebase = getFirebase()
  const profile = getState().firebase.profile
  const user = firebase.auth().currentUser
  const newComment = {
    displayName: profile.displayName,
    photoURL: profile.photoURL || "/assets/user.png",
    uid: user.uid,
    text: comment,
    date: Date.now(),
    parentId,
  }

  try {
    await firebase.push(`event_chat/${eventId}`, newComment)
  } catch (error) {
    console.log(error)
    toastr.error("Oops", "Error adding comment")
  }
}
