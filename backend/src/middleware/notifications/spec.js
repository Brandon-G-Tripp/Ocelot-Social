import { GraphQLClient } from 'graphql-request'
import { host, login } from '../../jest/helpers'
import Factory from '../../seed/factories'

const factory = Factory()
let client

beforeEach(async () => {
  await factory.create('User', {
    id: 'you',
    name: 'Al Capone',
    slug: 'al-capone',
    email: 'test@example.org',
    password: '1234'
  })
})

afterEach(async () => {
  await factory.cleanDatabase()
})

describe('currentUser { notifications }', () => {
  const query = `query($read: Boolean) {
          currentUser {
            notifications(read: $read, orderBy: createdAt_desc) {
              read
              post {
                content
              }
            }
          }
        }`

  describe('authenticated', () => {
    let headers
    beforeEach(async () => {
      headers = await login({ email: 'test@example.org', password: '1234' })
      client = new GraphQLClient(host, { headers })
    })

    describe('given another user', () => {
      let authorClient
      let authorParams
      let authorHeaders

      beforeEach(async () => {
        authorParams = {
          email: 'author@example.org',
          password: '1234',
          id: 'author'
        }
        await factory.create('User', authorParams)
        authorHeaders = await login(authorParams)
      })

      describe('who mentions me in a post', () => {
        let post
        const title = 'Mentioning Al Capone'
        const content = 'Hey <a class="mention" href="/profile/you/al-capone">@al-capone</a> how do you do?'

        beforeEach(async () => {
          const createPostMutation = `
          mutation($title: String!, $content: String!) {
            CreatePost(title: $title, content: $content) {
              id
              title
              content
            }
          }
          `
          authorClient = new GraphQLClient(host, { headers: authorHeaders })
          const { CreatePost } = await authorClient.request(createPostMutation, { title, content })
          post = CreatePost
        })

        it('sends you a notification', async () => {
          const expectedContent = 'Hey <a href="/profile/you/al-capone" target="_blank">@al-capone</a> how do you do?'
          const expected = {
            currentUser: {
              notifications: [
                { read: false, post: { content: expectedContent } }
              ]
            }
          }
          await expect(client.request(query, { read: false })).resolves.toEqual(expected)
        })

        describe('who mentions me again', () => {
          beforeEach(async () => {
            const updatedContent = `${post.content} One more mention to <a href="/profile/you" class="mention">@al-capone</a>`
            // The response `post.content` contains a link but the XSSmiddleware
            // should have the `mention` CSS class removed. I discovered this
            // during development and thought: A feature not a bug! This way we
            // can encode a re-mentioning of users when you edit your post or
            // comment.
            const createPostMutation = `
            mutation($id: ID!, $content: String!) {
              UpdatePost(id: $id, content: $content) {
                title
                content
              }
            }
            `
            authorClient = new GraphQLClient(host, { headers: authorHeaders })
            await authorClient.request(createPostMutation, { id: post.id, content: updatedContent })
          })

          it('creates exactly one more notification', async () => {
            const expectedContent = 'Hey <a href="/profile/you/al-capone" target="_blank">@al-capone</a> how do you do? One more mention to <a href="/profile/you" target="_blank">@al-capone</a>'
            const expected = {
              currentUser: {
                notifications: [
                  { read: false, post: { content: expectedContent } },
                  { read: false, post: { content: expectedContent } }
                ]
              }
            }
            await expect(client.request(query, { read: false })).resolves.toEqual(expected)
          })
        })
      })
    })
  })
})
