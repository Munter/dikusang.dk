import React from "react"

export default ({data}) => {
  const songs = data.allSongsJson.edges.map(e => e.node);

  return (
    <main>
      <ul>
        { songs.map(song => <li><a href={song.fields.slug}>{song.revueyear} - {song.title} - {song.melody}</a></li>) }
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
        composer
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

      }
    }
  }
}`;
