export interface MapDetails {
  position: { x: number; y: number };
  contestable: boolean;
  difficulty: 1 | 2 | 3;
  description?: string;
}

export interface MapSide {
  name: string;
  src: string;
  details?: Array<MapDetails>;
}

export interface MapPoint {
  name: string;
  src: string;
  sides: { [index: string]: MapSide };
}

export enum MapTypes {
  Assault = 'assault',
  Control = 'control',
  Hybrid = 'hybrid'
}

export interface Map {
  name: string;
  type: MapTypes;
  /*background: string; // use URL instead?
  thumbnail: string; // use URL instead?
  color: string; // download @types/color?*/
  points: { [index: string]: MapPoint };
}

const maps_imported: __WebpackModuleApi.RequireContext = require.context('./', true, /\.json$/);
const maps: { [index: string]: Map } = {};
export const filteredMaps: { [index in MapTypes]: Map } = Object.create(MapTypes);

maps_imported
  .keys()
  .forEach((key) => (maps[key.replace('./', '').replace('/data.json', '')] = maps_imported(key) as Map));

Object.keys(maps).forEach((key) => {
  filteredMaps[maps[key].type] = { ...filteredMaps[maps[key].type], ...{ [key]: maps[key] } };
});

export default maps;
