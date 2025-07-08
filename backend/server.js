const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
  const goldPrice = 75; 

  const enriched = products.map(p => ({
    ...p,
    priceUSD: parseFloat(((p.popularityScore + 1) * p.weight * goldPrice).toFixed(2)),
    popularityOutOf5: +(p.popularityScore * 5).toFixed(1)
  }));

  res.json(enriched);
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}/products`);
});
