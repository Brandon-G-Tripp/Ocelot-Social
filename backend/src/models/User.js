import uuid from 'uuid/v4'

module.exports = {
  id: { type: 'string', primary: true, default: uuid }, // TODO: should be type: 'uuid' but simplified for our tests
  actorId: { type: 'string', allow: [null] },
  name: { type: 'string', disallow: [null], min: 3 },
  slug: 'string',
  encryptedPassword: 'string',
  avatar: { type: 'string', allow: [null] },
  coverImg: { type: 'string', allow: [null] },
  deleted: { type: 'boolean', default: false },
  disabled: { type: 'boolean', default: false },
  role: { type: 'string', default: 'user' },
  publicKey: 'string',
  privateKey: 'string',
  wasInvited: 'boolean',
  wasSeeded: 'boolean',
  locationName: { type: 'string', allow: [null] },
  about: { type: 'string', allow: [null] },
  primaryEmail: {
    type: 'relationship',
    relationship: 'PRIMARY_EMAIL',
    target: 'EmailAddress',
    direction: 'out',
  },
  following: {
    type: 'relationship',
    relationship: 'FOLLOWS',
    target: 'User',
    direction: 'out',
  },
  followedBy: {
    type: 'relationship',
    relationship: 'FOLLOWS',
    target: 'User',
    direction: 'in',
  },
  friends: { type: 'relationship', relationship: 'FRIENDS', target: 'User', direction: 'both' },
  disabledBy: {
    type: 'relationship',
    relationship: 'DISABLED',
    target: 'User',
    direction: 'in',
  },
  rewarded: {
    type: 'relationship',
    relationship: 'REWARDED',
    target: 'Badge',
    direction: 'in',
  },
  invitedBy: { type: 'relationship', relationship: 'INVITED', target: 'User', direction: 'in' },
  createdAt: { type: 'string', isoDate: true, default: () => new Date().toISOString() },
  updatedAt: {
    type: 'string',
    isoDate: true,
    required: true,
    default: () => new Date().toISOString(),
  },
  emoted: {
    type: 'relationships',
    relationship: 'EMOTED',
    target: 'Post',
    direction: 'out',
    properties: {
      emotion: {
        type: 'string',
        valid: ['happy', 'cry', 'surprised', 'angry', 'funny'],
        invalid: [null],
      },
    },
    eager: true,
    cascade: true,
  },
  blocked: {
    type: 'relationship',
    relationship: 'BLOCKED',
    target: 'User',
    direction: 'out',
  },
  notifications: {
    type: 'relationship',
    relationship: 'NOTIFIED',
    target: 'Notification',
    direction: 'in',
  },
  termsAndConditionsAgreedVersion: {
    type: 'string',
    allow: [null],
  },
  termsAndConditionsAgreedAt: {
    type: 'string',
    isoDate: true,
    allow: [null],
    /* required: true, TODO */
  },
}
