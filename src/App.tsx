import React, { useEffect, useState, ChangeEvent } from 'react'
import './App.css';
import { Product, createProductCategory } from './types/index'
import _ from 'lodash'


const App = () => {

  const [data, setCount] = useState(createProductCategory);
  const [category, setCategory] = useState("uusimmat");
  const [filter, setFilter] = useState("");
  const [filtered, setFiltered] = useState(createProductCategory);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setCategory(event.target.value);
  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => setFilter(event.target.value);


  useEffect(() => {
    fetch(`http://localhost:3001/api/${category}`)
      .then((data) => data.json())
      .then((res) => {
        setCount(res)
        return setFiltered(res)
      });
  }, [category]);

  useEffect(() => {
    var productsCopy = _.map(data.products, _.clone);
    const products = productsCopy.filter((product: Product) => {
      if (!product.title.toLowerCase().includes(filter.toLowerCase()) ) {
        return false
      }
      return true
    })
    setFiltered({products})
  }, [data.products, filter]);

  const formatData = () => {
    const output = filtered.products.map((product: Product, index: number) => {
      return <tr key={index}>
        <td><a href={product.link} target="_blank" rel="noopener noreferrer">{ product.title }</a></td>
        <td>{ product.sale }</td>
        <td>{ product.normal }</td>
        <td>{ product.percent }</td>
        <td>{ product.store }</td>
        <td>{ product.added }</td>
      </tr>
    })
    return (
      <div className="table-container">
        <span className="tag is-dark"> { output.length } riviä </span>
        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Outlet</th>
              <th>Normi</th>
              <th>Alennus</th>
              <th>Kauppa</th>
              <th>Lisätty</th>
            </tr>
          </thead>
          <tbody>{ output }</tbody>
        </table>
      </div>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <span className="tag">Valitse kategoria</span>
        <div className="control">
          <label className="radio"><input type="radio" name="category" value="uusimmat" onChange={handleChange} checked={category === "uusimmat"} /> Uusimmat</label>
          <label className="radio"><input type="radio" name="category" value="kuva" onChange={handleChange} checked={category === "kuva"} /> Kuva</label>
          <label className="radio"><input type="radio" name="category" value="aani" onChange={handleChange} checked={category === "aani"} /> Ääni</label>
          <label className="radio"><input type="radio" name="category" value="tietokoneet" onChange={handleChange} checked={category === "tietokoneet"} /> Tietokoneet</label>
          <label className="radio"><input type="radio" name="category" value="puhelimet" onChange={handleChange} checked={category === "puhelimet"} /> Puhelimet ja kellot</label>
          <label className="radio"><input type="radio" name="category" value="kamera" onChange={handleChange} checked={category === "kamera"} /> Kamera</label>
          <label className="radio"><input type="radio" name="category" value="kodinkoneet" onChange={handleChange} checked={category === "kodinkoneet"} /> Kodinkoneet</label>
          <label className="radio"><input type="radio" name="category" value="pienkoneet" onChange={handleChange} checked={category === "pienkoneet"} /> Pienkoneet</label>
          <label className="radio"><input type="radio" name="category" value="pelit" onChange={handleChange} checked={category === "pelit"} /> Pelit ja konsolit</label>
        </div>
        <br />
        <input className="input" type="text" placeholder="Etsi..." value={filter} onChange={handleFilterChange} />
        <br /><br />
        { formatData() }
      </div>
  </section>
  )
}

export default App;
