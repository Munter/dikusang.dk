import React from 'react';
import Link from 'gatsby-link';

export default ({data}) => {
  const songs = data.allSongsJson.edges.map(e => e.node);

  return (
    <main>
      <ul>
        { songs.map(song => <li><Link to={song.fields.slug}>{song.revueyear} - {song.title} - {song.melody}</Link></li>) }
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
