const { seasons, persons, materials } = require("./data.json");

exports.resolvers = {
  Query: {
    productions: () => Object.values(seasons),
    persons: () => Object.values(persons),
    materials: (parent, args, context, info) => {
      const { type } = args;

      return Object.values(materials).filter(m => m.type === type);
    },

    production: (parent, args, context, info) => seasons[args.id],
    person: (parent, args, context, info) => persons[args.id],
    material: (parent, args, context, info) => materials[args.id]
  },

  Material: {
    authors: parent => {
      return parent.authors.map(a => persons[a]);
    },
    instructors: parent => {
      return parent.instructors.map(i => persons[i]);
    },
    roles: parent => {
      return parent.roles.map(role => ({
        ...role,
        actor: persons[role.actor],
        material: materials[role.material]
      }));
    }
  },

  Act: {
    materials: parent => {
      return parent.materials.map(m => materials[m]);
    }
  },

  Person: {
    authored: parent => {
      return parent.authored.map(materialId => materials[materialId]);
    },
    instructed: parent => {
      return parent.instructed.map(materialId => materials[materialId]);
    },
    played: parent => {
      return parent.played.map(role => ({
        ...role,
        actor: persons[role.actor],
        material: materials[role.material]
      }));
    }
  }
};
