import { mount, createLocalVue } from '@vue/test-utils'
import MySocialMedia from './my-social-media.vue'
import Vuex from 'vuex'
import Styleguide from '@human-connection/styleguide'
import Filters from '~/plugins/vue-filters'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Styleguide)
localVue.use(Filters)

describe('my-social-media.vue', () => {
  let wrapper
  let store
  let mocks
  let getters
  let input
  let submitBtn
  const socialMediaUrl = 'https://freeradical.zone/@mattwr18'

  beforeEach(() => {
    mocks = {
      $t: jest.fn(),
      $apollo: {
        mutate: jest
          .fn()
          .mockRejectedValue({ message: 'Ouch!' })
          .mockResolvedValueOnce({
            data: { CreateSocialMeda: { id: 's1', url: socialMediaUrl } },
          }),
      },
      $toast: {
        error: jest.fn(),
        success: jest.fn(),
      },
    }
    getters = {
      'auth/user': () => {
        return {}
      },
    }
  })

  describe('mount', () => {
    const Wrapper = () => {
      store = new Vuex.Store({
        getters,
      })
      return mount(MySocialMedia, { store, mocks, localVue })
    }

    it('renders', () => {
      wrapper = Wrapper()
      expect(wrapper.contains('div')).toBe(true)
    })

    describe('given currentUser has a social media account linked', () => {
      beforeEach(() => {
        getters = {
          'auth/user': () => {
            return {
              socialMedia: [{ id: 's1', url: socialMediaUrl }],
            }
          },
        }
      })

      it("displays a link to the currentUser's social media", () => {
        wrapper = Wrapper()
        const socialMediaLink = wrapper.find('a').attributes().href
        expect(socialMediaLink).toBe(socialMediaUrl)
      })

      beforeEach(() => {
        mocks = {
          $t: jest.fn(),
          $apollo: {
            mutate: jest
              .fn()
              .mockRejectedValue({ message: 'Ouch!' })
              .mockResolvedValueOnce({
                data: { DeleteSocialMeda: { id: 's1', url: socialMediaUrl } },
              }),
          },
          $toast: {
            error: jest.fn(),
            success: jest.fn(),
          },
        }
        getters = {
          'auth/user': () => {
            return {
              socialMedia: [{ id: 's1', url: socialMediaUrl }],
            }
          },
        }
      })

      it('displays a trash sympol after a social media and allows the user to delete it', () => {
        wrapper = Wrapper()
        const deleteSelector = wrapper.find({ name: 'delete' })
        expect(deleteSelector).toEqual({ selector: 'Component' })
        const icon = wrapper.find({ name: 'trash' })
        icon.trigger('click')
        expect(mocks.$apollo.mutate).toHaveBeenCalledTimes(1)
      })
    })

    describe('currentUser does not have a social media account linked', () => {
      it('allows a user to add a social media link', () => {
        wrapper = Wrapper()
        input = wrapper.find({ name: 'social-media' })
        input.element.value = socialMediaUrl
        input.trigger('input')
        submitBtn = wrapper.find('.ds-button')
        submitBtn.trigger('click')
        expect(mocks.$apollo.mutate).toHaveBeenCalledTimes(1)
      })
    })
  })
})
