const { gql } = require("apollo-server-lambda");

exports.typeDefs = gql`
  type Material {
    id: ID
    type: String
    production: Production
    roles: [Role]
    authors: [Person]
    instructors: [Person]
    props: [Prop]
    revueyear: String
    revuename: String
    title: String
    length: Float
    order: Int
    status: String
    version: String
    texLocation: String
    pdfLocation: String
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
    acts: [Act]
    minutes: Float
  }

  type Act {
    title: String
    length: Float
    order: Int
    materials: [Material]
  }

  type Person {
    id: ID
    authored: [Material]
    instructed: [Material]
    played: [Role]
  }

  type Query {
    productions: [Production]
    materials(type: String): [Material]
    persons: [Person]

    production(id: ID!): Production
    material(id: ID!): Material
    person(id: ID!): Person
  }
`;
