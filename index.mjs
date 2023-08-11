import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import haversine from 'haversine';

const tiles = new Map();
const args = process.argv.slice(2);

function key(latkey, lonkey) {
    return `${latkey},${lonkey}`;
}

createReadStream('unlocode.csv')
    .pipe(parse({ delimiter: ',', columns: true }))
    .on('data', (obj) => {
        let latkey = Math.round(obj.lat/1000);
        let lonkey = Math.round(obj.lon/1000);
        if (tiles.has(key(latkey, lonkey))) {
            tiles.get(key(latkey,  lonkey)).push(obj);
        } else {
            tiles.set(key(latkey, lonkey), [obj]);
        }
    })
    .on('end', () => {
        let lat = parseFloat(args[0]);
        let lon = parseFloat(args[1]);
        let latkey = Math.round(lat * 10);
        let lonkey = Math.round(lon * 10);
        let candidates = [];
        for (let tileLat = latkey - 1; tileLat <= latkey + 1; tileLat++) {
            for (let tileLon = lonkey - 1; tileLon <= lonkey + 1; tileLon++) {
                if (tiles.has(key(tileLat, tileLon))) {
                    let tile = tiles.get(key(tileLat,  tileLon));
                    candidates = candidates.concat(tile);
                }
            }
        }
        console.log({candidatesLength: candidates.length})
        let best = null;
        let bestDistance = Number.MAX_VALUE;
        for (let candidate of candidates) {
            const distance = haversine([lat, lon], [candidate.lat/10000.0, candidate.lon/10000.0], {format: "[lat,lon]"})
            if (distance < bestDistance) {
                best = candidate;
                bestDistance = distance;
            }
        }
        console.dir(best);
        console.dir(bestDistance);
    });