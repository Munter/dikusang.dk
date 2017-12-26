import React from 'react';

const Song = ({ data }) => {
  const song = data.songsJson;

  return (
    <main>
      <header>
        <p>{ song.revuename } { song.year }</p>
        <h1>{ song.title }</h1>
        <p>Forfatter: { song.author }</p>
        <p>Originalmelodi: { song.melody } ({ song.composer })</p>
      </header>

      <pre>
        { song.content }
      </pre>
    </main>
  );
};

export default Song;

export const query = graphql`
  query SongQuery($slug: String!) {
    songsJson(fields: { slug: { eq: $slug } }) {
      title
      author
      revueyear
      revuename
      year

      melody
      composer

      content
    }
  }
`;
