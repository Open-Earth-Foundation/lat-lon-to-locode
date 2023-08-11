# lat-lon-to-locode

This is a test project for seeing how to convert a lat/lon to a UN/LOCODE.

# Installation

Change to the project directory and run:

```bash
npm install
```

# Usage

Change to the project directory and run:

```bash
node index.mjs 51.5074 -0.1278
```

# Algorithm

The code uses the UN/LOCODE database harmonized for OpenClimate. It's just
a CSV with `locode`, `lat`, and `lon` columns. Lat and lon are integers representing the decimal value multiplied by 10000. For example, 51.5074 becomes 515074.

It first loads this CSV into a `tiles` structure, mapping each locode into an ~100km^2 tile of data based on the lat and lon. It just takes the integer lat/lon, divides by 1000, and then makes a tile key of "lat,lon". Each tile is an array of matching rows.

Then, it takes the decimal lat/lon you provide, and generates a key by multiplying by 10 and rounding. So 51.5074 becomes 515. It looks up the tile for that key, and also the 8 tiles adjacent to the key, getting a square about 30x30km. It then loops through all the rows in those tiles, and calculates the distance between the lat/lon you provided and the lat/lon in the row. It keeps track of the closest row, and returns that.

# Performance

It's fast enough, but the accuracy is not great. In particular, it seems like in a lot of urban areas, the closest center of a locoded object may not be the center of the polygon the point is in. So, I got a lot of false hits.

Probably the correct version would use polygons for each locode instead.