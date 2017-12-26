const globby = require('globby');
const loadJsonFile = require('load-json-file');
const fs = require('fs');
const pathModule = require('path');

const getSongContent = require('./getSongContent');

async function getSongsFromPath(path) {
  const data = await loadJsonFile(path);

  return data.acts.reduce((songs, act) => {
    const { materials, ...actProps } = act;

    const actSongs = act.materials
      .filter(material => material.type === 'song')
      .map(song => {
        song.act = actProps;
        song.year = parseInt((String(data.year) || String(data.revueyear)).replace(/[^\d]/g, ''), 10);
        song.revueName = data.name;

        song.rawTeX = fs.readFileSync(pathModule.resolve(pathModule.dirname(path), song.location), 'utf8');
        song.content = getSongContent(song.rawTeX, song);

        return song;
      });

    return [...songs, ...actSongs];
  }, []);
}


(async () => {
  const dataPaths = await globby('archive/*/json.js');

  const songsByYear = await Promise.all(dataPaths.map(getSongsFromPath));

  const songs = Array.prototype.concat.apply([], songsByYear);

  songs.sort((a, b) => {
    if (a.year === b.year) {
      return a.order - b.order;
    } else {
      return a.year - b.year;
    }
  });

  console.log(JSON.stringify(songs, undefined, 2));
})();
