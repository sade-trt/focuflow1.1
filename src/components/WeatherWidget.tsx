import { Cloud, CloudRain, Sun, CloudSnow, CloudLightning } from "lucide-react";
import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  label: string;
  range: string;
  icon: any;
  city: string;
};

const API_KEY = "1ba6a59c9fe43515a8f29cb0adde9666";

export function WeatherWidget() {
  const [data, setData] = useState<WeatherData>({
    temp: 0,
    label: "Loading...",
    range: "--",
    icon: Cloud,
    city: "",
  });

  useEffect(() => {
    const city = localStorage.getItem("uniCity") || "Tartu";

    async function loadWeather() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        const weather = await res.json();

        const condition = weather.weather?.[0]?.main || "Clouds";

        let icon = Cloud;

        if (condition.includes("Rain")) icon = CloudRain;
        else if (condition.includes("Clear")) icon = Sun;
        else if (condition.includes("Snow")) icon = CloudSnow;
        else if (condition.includes("Thunder")) icon = CloudLightning;

        setData({
          temp: Math.round(weather.main.temp),
          label: condition,
          range: `${Math.round(weather.main.temp_min)}° / ${Math.round(weather.main.temp_max)}°`,
          icon,
          city,
        });
      } catch (err) {
        console.error(err);

        setData({
          temp: 21,
          label: "Unavailable",
          range: "--",
          icon: Cloud,
          city,
        });
      }
    }

    loadWeather();
  }, []);

  const Icon = data.icon;

  return (
    <div className="glass animate-fade-in flex items-center justify-between rounded-3xl p-4">
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Weather • {data.city}
        </div>

        <div className="mt-0.5 font-display text-2xl font-semibold tabular-nums leading-none">
          {data.temp}°
        </div>

        <div className="mt-1 text-[11px] text-muted-foreground">
          {data.label} • {data.range}
        </div>
      </div>

      <div
        className="grid h-11 w-11 place-items-center rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--glow) 20%, transparent), color-mix(in oklab, var(--glow-2) 20%, transparent))",
          boxShadow: "0 0 30px -5px var(--glow)",
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
