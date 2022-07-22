export type Pokemon = {
  id: number
  name: string
  base_experience: number
  height: number
  is_default: boolean
  order: number
  weight: number
  abilities: Array<{
    is_hidden: boolean
    slot: number
    ability: {
      name: string
      url: string
    }
  }>
  forms: Array<{
    name: string
    url: string
  }>
  game_indices: Array<{
    game_index: number
    version: {
      name: string
      url: string
    }
  }>
  held_items: Array<{
    item: {
      name: string
      url: string
    }
    version_details: Array<{
      rarity: number
      version: {
        name: string
        url: string
      }
    }>
  }>
  location_area_encounters: string
  moves: Array<{
    move: {
      name: string
      url: string
    }
    version_group_details: Array<{
      level_learned_at: number
      version_group: {
        name: string
        url: string
      }
      move_learn_method: {
        name: string
        url: string
      }
    }>
  }>
  species: {
    name: string
    url: string
  }
  sprites: {
    back_default: string
    back_female: any
    back_shiny: string
    back_shiny_female: any
    front_default: string
    front_female: any
    front_shiny: string
    front_shiny_female: any
    other: {
      dream_world: {
        front_default: string
        front_female: any
      }
      home: {
        front_default: string
        front_female: any
        front_shiny: string
        front_shiny_female: any
      }
      'official-artwork': {
        front_default: string
      }
    }
    versions: {
      'generation-i': {
        'red-blue': {
          back_default: string
          back_gray: string
          front_default: string
          front_gray: string
        }
        yellow: {
          back_default: string
          back_gray: string
          front_default: string
          front_gray: string
        }
      }
      'generation-ii': {
        crystal: {
          back_default: string
          back_shiny: string
          front_default: string
          front_shiny: string
        }
        gold: {
          back_default: string
          back_shiny: string
          front_default: string
          front_shiny: string
        }
        silver: {
          back_default: string
          back_shiny: string
          front_default: string
          front_shiny: string
        }
      }
      'generation-iii': {
        emerald: {
          front_default: string
          front_shiny: string
        }
        'firered-leafgreen': {
          back_default: string
          back_shiny: string
          front_default: string
          front_shiny: string
        }
        'ruby-sapphire': {
          back_default: string
          back_shiny: string
          front_default: string
          front_shiny: string
        }
      }
      'generation-iv': {
        'diamond-pearl': {
          back_default: string
          back_female: any
          back_shiny: string
          back_shiny_female: any
          front_default: string
          front_female: any
          front_shiny: string
          front_shiny_female: any
        }
        'heartgold-soulsilver': {
          back_default: string
          back_female: any
          back_shiny: string
          back_shiny_female: any
          front_default: string
          front_female: any
          front_shiny: string
          front_shiny_female: any
        }
        platinum: {
          back_default: string
          back_female: any
          back_shiny: string
          back_shiny_female: any
          front_default: string
          front_female: any
          front_shiny: string
          front_shiny_female: any
        }
      }
      'generation-v': {
        'black-white': {
          animated: {
            back_default: string
            back_female: any
            back_shiny: string
            back_shiny_female: any
            front_default: string
            front_female: any
            front_shiny: string
            front_shiny_female: any
          }
          back_default: string
          back_female: any
          back_shiny: string
          back_shiny_female: any
          front_default: string
          front_female: any
          front_shiny: string
          front_shiny_female: any
        }
      }
      'generation-vi': {
        'omegaruby-alphasapphire': {
          front_default: string
          front_female: any
          front_shiny: string
          front_shiny_female: any
        }
        'x-y': {
          front_default: string
          front_female: any
          front_shiny: string
          front_shiny_female: any
        }
      }
      'generation-vii': {
        icons: {
          front_default: string
          front_female: any
        }
        'ultra-sun-ultra-moon': {
          front_default: string
          front_female: any
          front_shiny: string
          front_shiny_female: any
        }
      }
      'generation-viii': {
        icons: {
          front_default: string
          front_female: any
        }
      }
    }
  }
  stats: Array<{
    base_stat: number
    effort: number
    stat: {
      name: string
      url: string
    }
  }>
  types: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
  past_types: Array<{
    generation: {
      name: string
      url: string
    }
    types: Array<{
      slot: number
      type: {
        name: string
        url: string
      }
    }>
  }>
}
