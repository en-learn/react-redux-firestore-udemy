import React, { useEffect } from "react"
import { Grid } from "semantic-ui-react"
import UserDetailedHeader from "./UserDetailedHeader"
import UserDetailedSidebar from "./UserDetailedSidebar"
import UserDetailedDescription from "./UserDetailedDescription"
import UserDetailedPhotos from "./UserDetailedPhotos"
import UserDetailedEvents from "./UserDetailedEvents"
import { compose } from "redux"
import { connect } from "react-redux"
import { firestoreConnect, isEmpty } from "react-redux-firebase"
import { userDetailedQuery } from "../userQueries"
import { getUserEvents } from "../userActions"
import LoadingComponent from "../../../app/layout/LoadingComponent"

const mapState = (state, ownProps) => {
  let userUid = null
  let profile = {}

  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firebase.profile
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) &&
      state.firestore.ordered.profile[0]
    userUid = ownProps.match.params.id
  }

  return {
    userUid,
    profile,
    events: state.events.userEvents,
    eventsLoading: state.async.loading,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting,
  }
}

const actions = {
  getUserEvents,
}

const UserDetailedPage = ({
  events,
  eventsLoading,
  userUid,
  profile,
  photos,
  auth,
  match,
  requesting,
  getUserEvents,
}) => {
  const isCurrentUser = auth.uid === match.params.id
  const loading = Object.values(requesting).some(a => a === true)

  useEffect(() => {
    // Write the data fatching as an async named function...
    // async function fetchEvents() {
    //   let events = await getUserEvents(userUid)
    // }
    // fetchEvents()

    // Or as an IIFE
    ;(async () => {
      await getUserEvents(userUid)
    })()
  }, [userUid, getUserEvents])

  const changeTab = (e, data) => {
    getUserEvents(userUid, data.activeIndex)
  }

  if (loading) return <LoadingComponent />

  return (
    <Grid>
      <UserDetailedHeader profile={profile} />
      <UserDetailedDescription profile={profile} />
      <UserDetailedSidebar isCurrentUser={isCurrentUser} />
      {photos && photos.length > 0 && <UserDetailedPhotos photos={photos} />}
      <UserDetailedEvents
        events={events}
        eventsLoading={eventsLoading}
        changeTab={changeTab}
      />
    </Grid>
  )
}

export default compose(
  connect(mapState, actions),
  firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid)),
)(UserDetailedPage)
