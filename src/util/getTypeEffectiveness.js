const getTypeEffectiveness = {
  methods: {
    count (array) {
      return array.reduce((a, b) =>
        Object.assign(a, {[b]: (a[b] || 0) + 1}), {})
    },
    duplicates (dict) {
      return Object.keys(dict).filter((a) => dict[a] > 1)
    },
    getTypeEffectiveness (types) {
      var immunities = []
      var strengths = []
      var weaknesses = []

      for (const type of types) {
        switch (type.type.name) {
          case 'normal':
            immunities.push(...['ghost'])
            weaknesses.push(...['fighting'])
            break
          case 'fighting':
            strengths.push(...['rock', 'bug'])
            weaknesses.push(...['flying', 'psychic', 'fairy'])
            break
          case 'flying':
            immunities.push(...['ground'])
            strengths.push(...['fighting', 'bug', 'grass'])
            weaknesses.push(...['rock', 'electric', 'ice'])
            break
          case 'poison':
            strengths.push(...['fighting', 'poison', 'bug', 'grass', 'fairy'])
            weaknesses.push(...['ground', 'psychic'])
            break
          case 'ground':
            immunities.push(...['electric'])
            strengths.push(...['poison', 'rock'])
            weaknesses.push(...['water', 'grass', 'ice'])
            break
          case 'rock':
            strengths.push(...['normal', 'flying', 'poison', 'fire'])
            weaknesses.push(...['fighting', 'ground', 'steel', 'water', 'grass'])
            break
          case 'bug':
            strengths.push(...['fighting', 'ground', 'grass'])
            weaknesses.push(...['flying', 'rock', 'fire'])
            break
          case 'ghost':
            immunities.push(...['normal', 'fighting'])
            strengths.push(...['poison', 'bug'])
            weaknesses.push(...['ghost', 'dark'])
            break
          case 'steel':
            immunities.push(...['poison'])
            strengths.push(...['normal', 'flying', 'rock', 'bug', 'steel', 'grass', 'psychic', 'ice', 'dragon', 'fairy'])
            weaknesses.push(...['fighting', 'ground', 'fire'])
            break
          case 'fire':
            strengths.push(...['bug', 'steel', 'fire', 'grass', 'ice', 'fairy'])
            weaknesses.push(...['ground', 'rock', 'water'])
            break
          case 'water':
            strengths.push(...['steel', 'fire', 'water'])
            weaknesses.push(...['grass', 'electric'])
            break
          case 'grass':
            strengths.push(...['ground', 'water', 'grass', 'electric'])
            weaknesses.push(...['flying', 'poison', 'bug', 'fire', 'ice'])
            break
          case 'electric':
            strengths.push(...['flying', 'steel', 'electric'])
            weaknesses.push(...['ground'])
            break
          case 'psychic':
            strengths.push(...['fighting', 'psychic'])
            weaknesses.push(...['bug', 'ghost', 'dark'])
            break
          case 'ice':
            strengths.push(...['ice'])
            weaknesses.push(...['fighting', 'rock', 'steel', 'fire'])
            break
          case 'dragon':
            strengths.push(...['fire', 'water', 'grass', 'electric'])
            weaknesses.push(...['ice', 'dragon', 'fairy'])
            break
          case 'dark':
            immunities.push(...['psychic'])
            strengths.push(...['ghost', 'dark'])
            weaknesses.push(...['fighting', 'bug', 'fairy'])
            break
          case 'fairy':
            immunities.push(...['dragon'])
            strengths.push(...['fighting', 'bug', 'dark'])
            weaknesses.push(...['poison', 'steel'])
            break
        }
      }

      const strengthsSuper = this.duplicates(this.count(strengths))
      const weaknessesSuper = this.duplicates(this.count(weaknesses))

      strengths = [ ...new Set(strengths) ]
      weaknesses = [ ...new Set(weaknesses) ]

      return {
        immunities,
        strengths,
        strengthsSuper,
        weaknesses,
        weaknessesSuper
      }
    }
  }
}

export default getTypeEffectiveness
