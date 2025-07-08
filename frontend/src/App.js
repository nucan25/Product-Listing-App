import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});
  const [goldPrice, setGoldPrice] = useState(null); // 🟡 Altın fiyatı

  // --- Gram altın fiyatı (USD) çek ---
  useEffect(() => {
    fetch('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': 'goldapi-1jlsbk17mct6bjxf-io', // <<<<< Kendi GoldAPI anahtarını buraya yaz!
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        // 1. Önce price_gram_24k varsa onu kullan
        let gramFiyat = null;
        if (data && data.price_gram_24k) {
          gramFiyat = Number(data.price_gram_24k);
        } else if (data && data.price_oz) {
          gramFiyat = Number(data.price_oz) / 31.1034768;
        }
        setGoldPrice(gramFiyat ? gramFiyat.toFixed(2) : null);
      })
      .catch(() => setGoldPrice(null));
  }, []);

  // --- Ürünleri backend'den çek ---
  useEffect(() => {
    axios.get('http://localhost:3001/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("API error:", err));
  }, []);

  const handleColorChange = (index, color) => {
    setSelectedColors(prev => ({
      ...prev,
      [index]: color
    }));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, swipeToSlide: true } }
    ]
  };

  const StarRating = ({ rating, outOf = 5 }) => {
    const percentage = (rating / outOf) * 100;
    return (
      <div className="rating">
        <div className="stars-outer">
          <div className="stars-inner" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="rating-score">{rating.toFixed(1)} / {outOf}</div>
      </div>
    );
  };

  return (
    <div className="product-list">
      <h1 className="page-title">Product List</h1>

      <Slider {...settings}>
        {products.map((product, index) => {
          const selectedColor = selectedColors[index] || 'yellow';
          const weight = Number(product.weight);
          const popularity = Number(product.popularityScore);

          return (
            <div className="product-card" key={index}>
              <img
                src={product.images[selectedColor]}
                alt={product.name}
                className="product-img"
              />

              <h3 className="product-name">{product.name}</h3>

              <p className="product-price">
                {goldPrice
                  ? `$${(weight * goldPrice * (popularity + 1)).toFixed(2)} USD`
                  : 'Loading...'}
              </p>

              <div className="color-picker">
                {['yellow', 'white', 'rose'].map((color) => (
                  <button
                    key={color}
                    className={`color-btn ${color} ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => handleColorChange(index, color)}
                  />
                ))}
              </div>
              
              <p className="product-type">
                {selectedColor === 'yellow' && 'Yellow Gold'}
                {selectedColor === 'white' && 'White Gold'}
                {selectedColor === 'rose' && 'Rose Gold'}
              </p>
              <StarRating rating={product.popularityOutOf5} />
            </div>
          );
        })}
      </Slider>

      {/* 🟡 Canlı gram altın fiyatı - Sayfanın altına aldık */}
      <div style={{
        textAlign: "center",
        margin: "64px 0 0 0",
        fontFamily: "Montserrat",
        fontWeight: 500,
        fontSize: 18
      }}>
        Gold Price: {goldPrice ? `$${goldPrice} USD/gram` : "Loading..."}
      </div>
    </div>
  );

}

export default App;
