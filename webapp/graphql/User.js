import gql from 'graphql-tag'

export default i18n => {
  const lang = i18n.locale().toUpperCase()
  return gql`
    query User($id: ID!) {
      User(id: $id) {
        id
        slug
        name
        avatar
        about
        disabled
        deleted
        locationName
        location {
          name: name${lang}
        }
        createdAt
        badges {
          id
          icon
        }
        badgesCount
        shoutedCount
        commentedCount
        followingCount
        following(first: 7) {
          id
          slug
          name
          avatar
          disabled
          deleted
          followedByCount
          followedByCurrentUser
          contributionsCount
          commentedCount
          badges {
            id
            icon
          }
          location {
            name: name${lang}
          }
        }
        followedByCount
        followedByCurrentUser
        isBlocked
        followedBy(first: 7)  {
          id
          slug
          name
          disabled
          deleted
          avatar
          followedByCount
          followedByCurrentUser
          contributionsCount
          commentedCount
          badges {
            id
            icon
          }
          location {
            name: name${lang}
          }
        }
        socialMedia {
          id
          url
        }
      }
    }
  `
}
