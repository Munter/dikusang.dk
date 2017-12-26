import React from 'react';

const Song = ({ data }) => {
  const song = data.songsJson;
  const year = Number((String(song.revueyear) || String(song.year)).replace(/[^\d]/g, ''));

  return (
    <main>
      <header>
        <p>{ song.revuename } { year }</p>
        <h1>{ song.title }</h1>

        <pre>
          { song.vdom.children[0] }
        </pre>
      </header>
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

      vdom {
        children
      }
    }
  }
`;
