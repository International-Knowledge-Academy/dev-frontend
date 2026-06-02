// @ts-nocheck
import { useMemo, useState, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import type { Location } from "types/location";

const GEO_URL =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

// Navy-to-gold color scale matching brand
const COLOR_EMPTY  = "#e2e8f0";
const COLOR_LOW    = "#c7d9f0";
const COLOR_HIGH   = "#1e3a5f";
const COLOR_HOVER  = "#b45309"; // gold-700 on hover for active countries

interface CountryData {
  centers: number;
  programs: number;
}

interface TooltipState {
  x: number;
  y: number;
  country: string;
  data: CountryData;
}

interface WorldMapProps {
  locations: Location[];
  onCountryClick?: (country: string) => void;
  className?: string;
}

const WorldMap = ({ locations, onCountryClick, className = "" }: WorldMapProps) => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Group locations by country
  const countryMap = useMemo(() => {
    const map = new Map<string, CountryData>();
    locations.forEach((loc) => {
      const prev = map.get(loc.country) ?? { centers: 0, programs: 0 };
      map.set(loc.country, {
        centers:  prev.centers + 1,
        programs: prev.programs + (loc.course_count ?? 0),
      });
    });
    return map;
  }, [locations]);

  const maxPrograms = useMemo(
    () => Math.max(...Array.from(countryMap.values()).map((d) => d.programs), 1),
    [countryMap]
  );

  const colorScale = useMemo(
    () => scaleLinear<string>().domain([0, maxPrograms]).range([COLOR_LOW, COLOR_HIGH]),
    [maxPrograms]
  );

  const getColor = useCallback(
    (countryName: string) => {
      const data = countryMap.get(countryName);
      if (!data) return COLOR_EMPTY;
      if (hovered === countryName) return COLOR_HOVER;
      return colorScale(data.programs);
    },
    [countryMap, colorScale, hovered]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, countryName: string) => {
      const data = countryMap.get(countryName);
      setHovered(countryName);
      if (data) {
        setTooltip({ x: e.clientX, y: e.clientY, country: countryName, data });
      }
    },
    [countryMap]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
    setTooltip(null);
  }, []);

  const handleClick = useCallback(
    (countryName: string) => {
      if (countryMap.has(countryName)) onCountryClick?.(countryName);
    },
    [countryMap, onCountryClick]
  );

  const activeCountries = countryMap.size;

  return (
    <div className={`relative w-full select-none ${className}`}>

      {/* Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120, center: [15, 20] }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name    = geo.properties.name;
              const hasData = countryMap.has(name);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(name)}
                  stroke="#ffffff"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none", transition: "fill 0.3s ease" },
                    hover:   { outline: "none", transition: "fill 0.2s ease" },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={(e) => handleMouseEnter(e, name)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(name)}
                  className={hasData ? "cursor-pointer" : "cursor-default"}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-white border border-slate-100 rounded-xl shadow-xl px-3.5 py-2.5 min-w-[140px]"
          style={{ left: tooltip.x + 14, top: tooltip.y - 14 }}
        >
          <p className="text-xs font-bold text-navy-800 mb-1.5">{tooltip.country}</p>
          <div className="space-y-0.5">
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-navy-700">{tooltip.data.centers}</span>{" "}
              {tooltip.data.centers === 1 ? "center" : "centers"}
            </p>
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-navy-700">{tooltip.data.programs}</span>{" "}
              programs
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      {activeCountries > 0 && (
        <div className="absolute bottom-3 left-4 flex flex-col gap-1.5">
          <p className="text-xs text-slate-400 font-medium">Programs</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">0</span>
            <div
              className="w-28 h-2 rounded-full border border-slate-100"
              style={{ background: `linear-gradient(to right, ${COLOR_LOW}, ${COLOR_HIGH})` }}
            />
            <span className="text-xs text-slate-400">{maxPrograms}</span>
          </div>
          <p className="text-xs text-slate-300">{activeCountries} active {activeCountries === 1 ? "country" : "countries"}</p>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
