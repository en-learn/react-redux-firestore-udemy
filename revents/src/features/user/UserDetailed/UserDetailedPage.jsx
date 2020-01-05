import React from "react"
import { Button, Grid, Segment } from "semantic-ui-react"
import UserDetailedHeader from "./UserDetailedHeader"
import UserDetailedInfo from "./UserDetailedInfo"
import UserDetailedPhotos from "./UserDetailedPhotos"
import UserDetailedEvents from "./UserDetailedEvents"
import { compose } from "redux"
import { connect } from "react-redux"
import { firestoreConnect } from "react-redux-firebase"
import { Link } from "react-router-dom"

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
      <UserDetailedInfo profile={profile} />

      <Grid.Column width={4}>
        <Segment>
          <Button
            as={Link}
            to={"/settings"}
            color="teal"
            fluid
            basic
            content="Edit Profile"
          />
        </Segment>
      </Grid.Column>
      {photos && <UserDetailedPhotos photos={photos} />}
      <UserDetailedEvents />
    </Grid>
  )
}

export default compose(
  connect(mapState),
  firestoreConnect(({ auth }) => query(auth)),
)(UserDetailedPage)
