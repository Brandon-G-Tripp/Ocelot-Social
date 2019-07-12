import { Mention as TipTapMention } from 'tiptap-extensions'

export default class Mention extends TipTapMention {
  get name() {
    return 'mention'
  }

  get schema() {
    const patchedSchema = super.schema

    patchedSchema.attrs = {
      url: {},
      label: {},
    }
    patchedSchema.toDOM = node => {
      return [
        'a',
        {
          class: this.options.mentionClass,
          href: node.attrs.url,
          target: '_blank',
        },
        `${this.options.matcher.char}${node.attrs.label}`,
      ]
    }
    patchedSchema.parseDOM = [
      // this is not implemented
    ]
    return patchedSchema
  }
}
