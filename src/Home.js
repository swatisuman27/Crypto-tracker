import React, { useState, useEffect } from "react";
import "./Home.css";
import Coin from "./coins";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

const Home = () => {
  const getMode = () => {
    return JSON.parse(localStorage.getItem("mode")) || false;
  };

  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [dark, setDark] = useState(getMode());

  useEffect(() => {
    localStorage.setItem("mode", JSON.stringify(dark));

    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      )
      .then((res) => {
        setCoins(res.data);
        setIsLoaded(true);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dark]);

  const handleChange = (e) => {
    setSearch(e.target.value);
    setIsLoaded(true);
  };

  console.log(dark);
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className={dark ? "home-dark" : "home"}>
        <div className={dark ? "header-dark" : "header"}>
          <h1 className="brand">
            Coin<i className="fab fa-bitcoin"></i>Search
          </h1>
          <div className="actions">
            <form>
              <input
                className={dark ? "inputField-dark" : "inputField"}
                type="text"
                onChange={handleChange}
                placeholder={`  Search for a coin  `}
              />
            </form>
            <i className="fas fa-sun light"></i>
            <label className="switch">
              <input
                type="checkbox"
                checked={dark}
                onChange={() => setDark(!dark)}
              />
              <span className="slider round"></span>
            </label>
            <i className="fas fa-moon dark"></i>
          </div>
        </div>
        {!isLoaded ? (
          <Spinner
            className="loading"
            animation="border"
            variant="danger"
            size="lg"
          />
        ) : (
          <div className="coinsContainer">
            {filteredCoins.map((coin) => {
              return (
                <Coin
                  key={coin.id}
                  name={coin.name}
                  price={coin.current_price}
                  symbol={coin.symbol}
                  marketcap={coin.market_cap}
                  volume={coin.total_volume}
                  image={coin.image}
                  priceChange={coin.price_change_percentage_24h}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
