const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require('path');
const slugify = require('slugify');

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;

  if (node.internal.type === 'SongsJson') {
    const slug = `${node.year}/${path.basename(node.location, path.extname(node.location))}`;
    // const slug = `${year}/${slugify(node.title)}`;
    console.log(slug);

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
}

const createPageQuery = `
  {
    allSongsJson {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
  }
`;

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    graphql(createPageQuery)
      .then(result => {
        result.data.allSongsJson.edges.map(({ node }) => {
          createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/Song.js`),
            context: {
              // Data passed to context is available in page queries as GraphQL variables.
              slug: node.fields.slug,
            },
          })
        })

        // console.log(JSON.stringify(result, null, 4))
        resolve()
      });
  });
}
