const { ApolloServer, gql } = require("apollo-server-express");
const { seasons, persons, materials } = require("./data.json");

const typeDefs = gql`
  type Material {
    id: ID
    type: String
    roles: [Role]
    authors: [Person]
    instructors: [Person]
    props: [Prop]
    revueyear: String
    title: String
  }

  type Prop {
    name: String
    description: String
    responsible: String
  }

  type Role {
    id: ID
    material: Material
    actor: Person
    title: String
    abbreviation: String
  }

  type Production {
    id: ID
    name: String
    year: Int
  }

  type Person {
    id: ID
    authored: [Material]
    instructed: [Material]
    played: [Role]
  }

  type Query {
    productions: [Production]
    materials: [Material]
    persons: [Person]

    production(id: ID!): Production
    material(id: ID!): Material
    person(id: ID!): Person
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    productions: () => Object.values(seasons),
    persons: () => Object.values(persons),
    materials: (parent, args, context, info) => {
      console.log({ parent, args, context, info });
      return Object.values(materials);
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

const server = new ApolloServer({
  typeDefs,
  resolvers
});

module.exports = server;
