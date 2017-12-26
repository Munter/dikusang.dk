import React from "react"

export default ({data}) => {
  const songs = data.allSongsJson.edges.map(e => e.node);

  return (
    <main>
      <ul>
        { songs.map(song => <li><a href={song.fields.slug}>{song.revueyear} - {song.title}</a></li>) }
      </ul>
    </main>
  );

};

export const query = graphql`
query songs {
 allSongsJson {
    edges {
      node {
        revuename,
        revueyear,
        title,
        melody
        author

        fields {
          slug
        }

        props {
          description
          name
          responsible
        }

        roles {
          actor
          abbr
          title
        }

        vdom {
          component,
          children
        }

      }
    }
  }
}`;
