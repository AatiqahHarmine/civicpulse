import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, AlertCircle, Compass } from 'lucide-react';

// Sub-component to handle map movement/fly-to panning
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 14, { animate: true, duration: 1.2 });
    }
  }, [center, map]);
  return null;
};

// SVG DivIcons for Leaflet severity coloring
const getCustomIcon = (severity) => {
  let color = '#64748b'; // Slate
  if (severity === 'Critical') color = '#ef4444'; // Red
  if (severity === 'High') color = '#f97316'; // Orange
  if (severity === 'Medium') color = '#f59e0b'; // Amber
  if (severity === 'Low') color = '#10b981'; // Green

  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute inline-flex h-4 w-4 rounded-full" style="background-color: ${color}; opacity: 0.4;"></span>
        <div style="
          background-color: ${color};
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 6px rgba(0,0,0,0.4);
        "></div>
      </div>
    `,
    className: 'custom-leaflet-icon',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

const MapExplorer = () => {
  const [points, setPoints] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState([12.9716, 77.5946]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const json = await api.analytics.getHeatmap();
        if (json.success) {
          setPoints(json.data);
          if (json.data.length > 0 && json.data[0].latitude && json.data[0].longitude) {
            setSelectedCenter([json.data[0].latitude, json.data[0].longitude]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoordinates();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="text-blue-600" size={32} /> Interactive GIS Map
          </h1>
          <p className="text-slate-500 text-sm mt-1">Geographic distribution of reported civic infrastructure issues and severity alerts.</p>
        </div>
        <div className="text-xs bg-blue-50 border border-blue-100 text-blue-800 font-bold px-3 py-1.5 rounded-xl">
          📡 {points.length} Active Incidents Connected
        </div>
      </div>

      {loading ? (
        <div className="h-[550px] bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-medium">
          Loading GIS Engine...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Issue List */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm h-[550px] flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 mb-3 text-base flex items-center gap-1.5 border-b pb-2">
                <AlertCircle className="text-slate-400" size={18} /> Active Reports Feed
              </h3>
              <div className="space-y-2.5 overflow-y-auto max-h-[440px] pr-1 scrollbar-thin">
                {points.length === 0 && (
                  <div className="text-slate-400 text-center py-10 text-xs">No active reports inside the database.</div>
                )}
                {points.map((pt, idx) => (
                  <div
                    key={pt._id || idx}
                    onClick={() => {
                      if (pt.latitude && pt.longitude) {
                        setSelectedCenter([pt.latitude, pt.longitude]);
                      }
                    }}
                    className="p-3 bg-slate-50 hover:bg-blue-50/50 border hover:border-blue-100 rounded-xl cursor-pointer transition-all duration-200 text-left group"
                  >
                    <div className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{pt.title}</div>
                    <div className="flex items-center justify-between mt-2 text-[10px]">
                      <span className="text-slate-400 flex items-center gap-0.5 truncate">
                        <MapPin size={10} /> {pt.location || 'Unknown'}
                      </span>
                      <span className={`font-black uppercase px-1.5 py-0.5 rounded text-[8px] ${
                        pt.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        pt.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                        pt.severity === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>{pt.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 text-center pt-2 border-t">
              Click any report above to center the GIS viewport.
            </div>
          </div>

          {/* Right Panel - Map Viewport */}
          <div className="lg:col-span-2 h-[550px] border border-slate-200 rounded-2xl overflow-hidden shadow-sm z-10">
            <MapContainer center={selectedCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ChangeMapView center={selectedCenter} />

              {points.map((pt, idx) => {
                if (!pt.latitude || !pt.longitude) return null;
                return (
                  <Marker
                    key={pt._id || idx}
                    position={[pt.latitude, pt.longitude]}
                    icon={getCustomIcon(pt.severity)}
                  >
                    <Popup>
                      <div className="p-2 space-y-1 font-sans text-xs">
                        <div className="font-extrabold text-sm text-slate-900 leading-snug">{pt.title}</div>
                        <div className="flex gap-1.5 items-center my-1.5">
                          <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-bold uppercase text-[9px]">{pt.category}</span>
                          <span className={`px-1.5 py-0.5 rounded font-extrabold uppercase text-[9px] ${
                            pt.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                            pt.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                            pt.severity === 'Medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>{pt.severity}</span>
                        </div>
                        <div className="text-slate-500 font-medium">📍 {pt.location}</div>
                        <div className="text-slate-400 text-[10px] mt-1 flex justify-between">
                          <span>Status: <strong className="text-slate-700">{pt.status}</strong></span>
                          {pt.severityScore && <span>AI Score: <strong>{pt.severityScore}/10</strong></span>}
                        </div>
                        <div className="mt-2.5 pt-2 border-t text-center">
                          <Link to={`/issue/${pt._id}`} className="text-blue-600 font-bold hover:underline hover:text-blue-700 transition">View Details →</Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapExplorer;
