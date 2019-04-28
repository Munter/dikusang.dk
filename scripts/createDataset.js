const globby = require("globby");
const loadJsonFile = require("load-json-file");
const pathModule = require('path');

const personMap = {
  "dybbber": "martin dybdal",
  "mighty munter": "munter",
  boelling: "bo elling",
  boælling: "bo elling",
  "bo ælling": "bo elling",
  fairchil: "fairchild",
  "harlems hårde hurlumhejsere": "harlem klub",
  "jakob uhd af revyen": "jakob uhd",
  "jakob uhd jepsen": "jakob uhd",
  uhd: "jakob uhd",
  jenny: "jenny-margrethe vej",
  "katrine hommelhof": "katrine hommelhof jensen",
  madssß: "mads sejersen",
  madß: "mads sejersen",
  madss: "mads sejersen",
  "mad\\ss": "mads sejersen",
  msiebuhr: "morten siebuhr",
  siebuhr: "morten siebuhr",

  "søren tm": "søren trautner madsen",
  "søren trautner": "søren trautner madsen",
  "søren trauntner madsen": "søren trautner madsen",
  "trauma": "søren trautner madsen",
  "søren (\\texttt{trauma})": "søren trautner madsen",
  "søren (\\texttt{trauma}) -- det er deres skuld det hele": "søren trautner madsen",

  "buzz": "niels bosworth",
  "buzzword": "niels bosworth",
  "niels buzz-worth": "niels bosworth",
  "uffe c": "uffe christensen",
  "uffe chistensen": "uffe christensen",
  uffec: "uffe christensen",
  "uffe friis": "uffe friis lichtenberg",

  "uffe fl": "uffe friis lichtenberg",
  "uffefl": "uffe friis lichtenberg",
  "ulla": "uffe friis lichtenberg",
  "ulla tordenskjold": "uffe friis lichtenberg",
  "uphphefl": "uffe friis lichtenberg",
  "{\\tt uffefl}": "uffe friis lichtenberg",

  "katrine h": "katrine hommelhoff jensen",
  "katerine hommelhof jensen": "katrine hommelhoff jensen"
};

function getCleanId(id) {
  const cleanId = id
    .replace(/^X /, "")
    .replace(/\?+/g, "")
    .toLowerCase()
    .trim();

  return personMap[cleanId] || cleanId;
}

/**
 * @typedef {{
 *   abbr: string,
 *   actor: string,
 *   title: string
 * }} Role
 *
 * @typedef {{
 *   name: string,
 *   description: string,
 *   responsible: string
 * }} Prop
 *
 * @typedef {{
 *   revueyear: string,
 *   author: string,
 *   status: string,
 *   type: "sketch"|"song"|"video",
 *   title: string,
 *   version: string,
 *   props: Prop[],
 *   revuename: string,
 *   length: string,
 *   roles: Role[],
 *   order: number,
 *   composer: string,
 *   melody: string,
 *   location: string,
 *
 * }} Material
 */

(async () => {
  const dataPaths = await globby(pathModule.resolve(__dirname, '../archive/*/json.js'));

  const persons = {};
  const allMaterials = {};
  const seasons = {};

  function getPerson(id) {
    if (!id) {
      return;
    }

    const cleanId = getCleanId(id);

    if (cleanId) {
      const [first, ...rest] = cleanId;

      if (first != first.toLowerCase() && first == first.toUpperCase()) {
        throw new Error(`waat "${first}"`);
      }
      let person = persons[cleanId];

      if (!person) {
        person = {
          id: cleanId,
          played: [],
          authored: [],
          instructed: []
        };

        persons[cleanId] = person;
      }

      return person;
    }
  }

  /**
   * @type [
   *  Array<{
   *    name: string,
   *    year: number,
   *    acts: Array<{
   *      title: string,
   *      length: number,
   *      order: number,
   *      materials: Material[]
   *     }>
   *   }>
   * ]
   */
  const allYears = await Promise.all(dataPaths.map(loadJsonFile));

  for (const { year, name, acts } of allYears) {
    const yearData = {
      id: `${name}-${year}`,
      year,
      name,
      minutes: 0,
      acts: []
    };

    for (const { materials, length: minutes, ...actData } of acts) {
      const materialsReferences = [];

      for (const m of materials) {
        const {
          location,
          roles = [],
          author = "",
          instructors = [],
          melody,
          composer,
          length,
          ...material
        } = m;

        const materialData = {
          ...material,
          id: `${name}-${year}-${location}`,
          length: parseFloat(length),
          texLocation: `${year}/${location}`,
          pdfLocation: `${year}/${location.replace(/\.tex$/, ".pdf")}`,
          melody,
          composer,

          authors: [],
          roles: [],
          instructors: []
        };

        for (const { actor, abbr, title } of roles) {
          const person = getPerson(actor);

          if (person) {
            if (abbr.toLowerCase() === 'x' && title.toLowerCase() === 'instruktør') {
              person.instructed.push(materialData.id);
              materialData.instructors.push(person.id);
            } else {
              const roleData = {
                abbr,
                title,
                material: materialData.id,
                actor: person.id
              };

              person.played.push(roleData);
              materialData.roles.push(roleData);
            }
          }
        }

        const authors = author
          .trim()
          .replace(" strammet af", "")
          .replace(" strammet op af", "")
          .replace(" m.fl.", "")
          .replace(" m. endnu fl.", "")
          .replace(" et. al.", "")
          .replace(" et.\\ al.", "")
          .replace(" o.\\ a.\\", "")
          .split(/ *(?:\+|\\&|og|,) */g)
          .filter(Boolean);

        for (const individualAuthor of authors) {
          const person = getPerson(individualAuthor);

          if (person) {
            person.authored.push(materialData.id);

            materialData.authors.push(person.id);
          }
        }

        for (const instructor of instructors) {
          const person = getPerson(instructor);

          if (person) {
            person.instructed.push(materialData.id);

            materialData.instructors.push(person.id);
          }
        }

        materialsReferences.push(materialData.id);
        allMaterials[materialData.id] = materialData;
      }

      yearData.acts.push({
        ...actData,
        minutes,
        materials: materialsReferences
      });
      yearData.minutes += parseFloat(minutes);
    }

    seasons[yearData.id] = yearData;
  }

  const data = {
    seasons,
    materials: allMaterials,
    persons
  };

  // console.log(JSON.stringify(Object.keys(persons).sort()));

  console.log(JSON.stringify(data, undefined, 2));
})();
