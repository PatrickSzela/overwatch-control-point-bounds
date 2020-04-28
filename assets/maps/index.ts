export interface MapDetails {
  position: { x: number; y: number };
  contestable: boolean;
  difficulty?: 0 | 1 | 2 | 3;
  description?: string;
}

export interface MapSide {
  name: string;
  src: string;
  height?: number;
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
  points: { [index: string]: MapPoint };
}

const mapsImported: __WebpackModuleApi.RequireContext = require.context('./', true, /\.json$/);
const maps: { [index: string]: Map } = {};
export const filteredMaps: { [index in MapTypes]: Map } = Object.create(MapTypes);

mapsImported
  .keys()
  .forEach((key) => (maps[key.replace('./', '').replace('/data.json', '')] = mapsImported(key) as Map));

Object.keys(maps).forEach((key) => {
  filteredMaps[maps[key].type] = { ...filteredMaps[maps[key].type], ...{ [key]: maps[key] } };
});

export default maps;
