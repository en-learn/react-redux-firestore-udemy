import React from "react"
import { Grid } from "semantic-ui-react"
import UserDetailedHeader from "./UserDetailedHeader"
import UserDetailedSidebar from "./UserDetailedSidebar"
import UserDetailedDescription from "./UserDetailedDescription"
import UserDetailedPhotos from "./UserDetailedPhotos"
import UserDetailedEvents from "./UserDetailedEvents"
import { compose } from "redux"
import { connect } from "react-redux"
import { firestoreConnect } from "react-redux-firebase"

const query = auth => [
  {
    collection: "users",
    doc: auth.uid,
    subcollections: [{ collection: "photos" }],
    storeAs: "photos",
  },
]

const mapState = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  photos: state.firestore.ordered.photos,
})

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
  firestoreConnect(({ auth }) => query(auth)),
)(UserDetailedPage)
