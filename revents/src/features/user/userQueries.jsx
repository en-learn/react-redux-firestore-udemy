export const userDetailedQuery = ({ auth, userUid }) => {
  console.log(userUid)
  if (userUid !== null) {
    return [
      {
        collection: "users",
        doc: userUid,
        storeAs: "profile",
      },
      userPhotoQuery(userUid),
    ]
  } else {
    return [userPhotoQuery(auth.uid)]
  }
}

export const userPhotoQuery = userUid => ({
  collection: "users",
  doc: userUid,
  subcollections: [{ collection: "photos" }],
  storeAs: "photos",
})
