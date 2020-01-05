import React from "react"
import { Grid, Segment, Header, Item, Icon, List } from "semantic-ui-react"
import { format } from "date-fns"

const UserDetailedDescription = ({
  profile,
  profile: { displayName, occupation, city, about, interests },
}) => {
  let createdAt
  if (profile && profile.createdAt) {
    createdAt = format(profile.createdAt.toDate(), "EEEE do LLL")
  }
  return (
    <Grid.Column width={12}>
      <Segment>
        <Grid columns={2}>
          <Grid.Column width={10}>
            <Header icon="smile" content={"About " + displayName} />
            <p>
              I am a: <strong>{occupation}</strong>
            </p>
            <p>
              Originally from <strong>{city}</strong>
            </p>
            <p>
              Member Since: <strong>{createdAt}</strong>
            </p>
            <p>{about}</p>
          </Grid.Column>
          <Grid.Column width={6}>
            <Header icon="heart outline" content="Interests" />
            {interests && interests.length > 0 ? (
              <List>
                {interests.map((interest, index) => (
                  <Item key={index}>
                    <Icon name="heart" />
                    <Item.Content>
                      {interest[0].toUpperCase() + interest.substring(1)}
                    </Item.Content>
                  </Item>
                ))}
              </List>
            ) : (
              <p>No interests</p>
            )}
          </Grid.Column>
        </Grid>
      </Segment>
    </Grid.Column>
  )
}

export default UserDetailedDescription
