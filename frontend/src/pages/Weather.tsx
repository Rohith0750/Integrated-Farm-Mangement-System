import React, { useEffect, useState } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Sun,
  CloudDrizzle,
  CloudLightning,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { weatherService } from '../services/weatherService';
import { WeatherRecord } from '../types';

export const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherRecord | null>(null);

  useEffect(() => {
    weatherService.getWeather().then(setWeather);
  }, []);

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun': return <Sun className="w-8 h-8 text-amber-400" />;
      case 'cloud-rain': return <CloudRain className="w-8 h-8 text-sky-400" />;
      case 'cloud-drizzle': return <CloudDrizzle className="w-8 h-8 text-teal-400" />;
      case 'cloud-lightning': return <CloudLightning className="w-8 h-8 text-amber-500" />;
      default: return <CloudSun className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Agri Weather & Environmental Advisory"
        subtitle="Hyper-local microclimate weather station telemetry and agricultural risk mitigation."
        icon={<CloudSun className="w-6 h-6" />}
      />

      {/* Main Weather Telemetry Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-agri-950 text-white rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-agri-300 border border-white/10 mb-3">
              <CloudSun className="w-4 h-4 text-amber-400" /> Active Weather Station
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold">{weather?.location}</h2>
            <p className="text-sm text-slate-400 mt-1">Live updates • Telemetry refreshed {weather?.timestamp}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-5xl lg:text-6xl font-black text-white">{weather?.temperature}°C</span>
              <span className="block text-sm font-bold text-agri-400 uppercase tracking-wider mt-1">{weather?.condition}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400">Relative Humidity</span>
              <span className="text-xl font-extrabold text-white">{weather?.humidity}%</span>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400">Wind Velocity</span>
              <span className="text-xl font-extrabold text-white">{weather?.windSpeed} km/h</span>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400">Precipitation</span>
              <span className="text-xl font-extrabold text-white">{weather?.rainfall} mm</span>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400">Solar Radiation</span>
              <span className="text-xl font-extrabold text-white">22.4 MJ/m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Support Engine Visual Connector: Agricultural Weather Impact */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-50/60 to-agri-50/40 rounded-3xl p-6 border border-amber-200/80 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <span className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </span>
          <h3 className="text-lg font-bold text-slate-900">Agricultural Weather Impact & Advisory Link</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-xs">
            <span className="text-xs font-bold uppercase text-amber-800 tracking-wider">Observed Impact Signal</span>
            <p className="text-lg font-extrabold text-slate-900 mt-1">
              "Heavy rainfall (&gt;45mm) expected within 12 to 24 hours across Sector 4."
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Atmospheric pressure drops registered across telemetry sensors indicating incoming convective thunderstorm front.
            </p>
          </div>

          <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Decision Engine Recommended Action
              </span>
              <p className="text-lg font-extrabold text-emerald-50 mt-1">
                "DELAY SCHEDULED IRRIGATION & TOP-DRESSING"
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-200 mt-4 pt-3 border-t border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Saves approximately $340 in water pumping electricity and avoids fertilizer runoff.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Weather Forecast Cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-agri-700" />
          <h3 className="text-lg font-extrabold text-slate-900">7-Day Meteorological Outlook</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather?.forecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                idx === 0
                  ? 'bg-agri-900 text-white border-agri-950 shadow-md font-bold'
                  : 'bg-white text-slate-800 border-slate-200/80 hover:shadow-sm font-semibold'
              }`}
            >
              <div>
                <span className={`block text-xs font-bold ${idx === 0 ? 'text-agri-300' : 'text-slate-500'}`}>
                  {day.day}
                </span>
                <span className={`block text-[10px] ${idx === 0 ? 'text-slate-300' : 'text-slate-400'}`}>
                  {day.date}
                </span>
              </div>

              <div className="my-3">{getWeatherIcon(day.icon)}</div>

              <div>
                <span className="block text-base font-extrabold">{day.tempMax}°C</span>
                <span className={`block text-xs ${idx === 0 ? 'text-slate-400' : 'text-slate-400'}`}>
                  Low: {day.tempMin}°C
                </span>
              </div>

              <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                idx === 0 ? 'bg-white/10 text-white' : 'bg-sky-50 text-sky-700 border border-sky-200'
              }`}>
                Rain: {day.rainProb}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
