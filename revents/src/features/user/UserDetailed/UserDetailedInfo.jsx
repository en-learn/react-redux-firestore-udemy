import React from "react"
import { Grid, Segment, Header, Item, Icon, List } from "semantic-ui-react"
import { format } from "date-fns"

const UserDetailedInfo = ({
  profile: { displayName, occupation, city, createdAt, about, interests },
}) => {
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
              Member Since:{" "}
              <strong>
                {createdAt && format(createdAt.toDate(), "EEEE do LLLL")}
              </strong>
            </p>
            <p>{about}</p>
          </Grid.Column>
          <Grid.Column width={6}>
            <Header icon="heart outline" content="Interests" />
            <List>
              {interests.map(interest => (
                <Item>
                  <Icon name="heart" />
                  <Item.Content>
                    {interest[0].toUpperCase() + interest.substring(1)}
                  </Item.Content>
                </Item>
              ))}
            </List>
          </Grid.Column>
        </Grid>
      </Segment>
    </Grid.Column>
  )
}

export default UserDetailedInfo
