import { useCallback, useEffect, useState, Fragment } from "react";
import "./App.css";
import Nasa from "../public/NASA_logo.png";
import Dices from "../public/dices.png";

function App() {
  const [apod, setApod] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  let todaysDate = new Date(new Date().setDate(new Date().getDate() - count))
    .toISOString()
    .split("T")[0];

  const fetchApodHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=_KEY=${todaysDate}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      setApod(data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }, [count]);

  useEffect(() => {
    fetchApodHandler();
  }, [fetchApodHandler]);

  const dateFirstApod = "1995-06-16T00:00:00.000Z";
  const currentDate = Date.parse(new Date().toString());
  const daysFirstApod = (currentDate - Date.parse(dateFirstApod)) / 86400000;

  return (
    <Fragment>
      {!loading && (
        <main>
          <section className="section-1">
            <img src={Nasa} width={100} />
            <div>
              <h1>Nasa Web</h1>
              <p>Astronomy Picture of the Day</p>
            </div>
          </section>
          <section className="section-2">
            <div className="copyrigth">
              {apod.media_type === "image" && (
                <a href={apod.hdurl} target="_blank">
                  <img className="day-image" src={apod.url || apod.hdurl} />
                </a>
              )}
              {apod.media_type === "video" && (
                <iframe className="video" allowFullScreen src={apod.url} />
              )}
              {apod.copyright && (
                <p>Image Credit & Copyright: {apod.copyright}</p>
              )}
            </div>
            <div className="info">
              <h2>{apod.title}</h2>
              <p>{apod.date}</p>
              <p>{apod.explanation}</p>
              <button
                type="button"
                onClick={() => setCount(Math.random() * daysFirstApod)}
              >
                <img src={Dices} width={60} alt="Dices" />
              </button>
            </div>
          </section>
        </main>
      )}
      {loading && <div class="loader"></div>}
      {!loading && error && <p>{error}</p>}
    </Fragment>
  );
}

export default App;
