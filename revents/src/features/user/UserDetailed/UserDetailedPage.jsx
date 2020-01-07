import React from "react"
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
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos,
  }
}

const UserDetailedPage = ({ profile, photos }) => {
  return (
    <Grid>
      <UserDetailedHeader profile={profile} />
      <UserDetailedDescription profile={profile} />
      <UserDetailedSidebar />
      {photos && photos.length > 0 && <UserDetailedPhotos photos={photos} />}
      <UserDetailedEvents />
    </Grid>
  )
}

export default compose(
  connect(mapState),
  firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid)),
)(UserDetailedPage)
