const { gql } = require("apollo-server-lambda");

exports.schema = gql`
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
