const songMarkers = /\\(?:begin|end)\{song\}/g;

function getSongContent(tex, material) {
  const songContent = tex.split(songMarkers)[1];

  return songContent;
}

module.exports = getSongContent;
