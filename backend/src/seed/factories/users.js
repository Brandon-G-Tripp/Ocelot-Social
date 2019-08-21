import faker from 'faker'
import uuid from 'uuid/v4'
import encryptPassword from '../../helpers/encryptPassword'
import slugify from 'slug'

export default function create() {
  return {
    factory: async ({ args, neodeInstance }) => {
      const defaults = {
        id: uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: '1234',
        role: 'user',
        avatar: faker.internet.avatar(),
        about: faker.lorem.paragraph(),
        termsAndConditionsAgreedAt: new Date().toISOString(),
        termsAndConditionsAgreedVersion: '0.0.2',
      }
      defaults.slug = slugify(defaults.name, { lower: true })
      args = {
        ...defaults,
        ...args,
      }
      args = await encryptPassword(args)
      const user = await neodeInstance.create('User', args)
      const email = await neodeInstance.create('EmailAddress', { email: args.email })
      await user.relateTo(email, 'primaryEmail')
      await email.relateTo(user, 'belongsTo')
      return user
    },
  }
}

 
