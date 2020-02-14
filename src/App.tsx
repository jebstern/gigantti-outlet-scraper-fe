import React, { useEffect, useState, ChangeEvent } from 'react'
import './App.css';
import { Product, createProductCategory } from './types/index'
import _ from 'lodash'
import Container from '@material-ui/core/Container';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    table: {
      minWidth: 650,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    container: {
      marginTop: '5rem',
    }
  }),
);

const API_URL = process.env.NODE_ENV === "production" ? "gigantti-outlet-scraper-be.herokuapp.com/api/" : "http://localhost:3001/api/"

const App = () => {
  const classes = useStyles();
  const [data, setCount] = useState(createProductCategory);
  const [category, setCategory] = useState("uusimmat");
  const [filter, setFilter] = useState("");
  const [filtered, setFiltered] = useState(createProductCategory);
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>, child: React.ReactNode) => setCategory(event.target.value);
  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => setFilter(event.target.value);


  useEffect(() => {
    fetch(`${API_URL}${category}`)
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
      return <TableRow key={index}>
        <TableCell component="th" scope="row">
          <a href={product.link} target="_blank" rel="noopener noreferrer">{ product.title }</a>
        </TableCell>
        <TableCell align="right">{ product.sale }</TableCell>
        <TableCell align="right">{ product.normal }</TableCell>
        <TableCell align="right">{ product.percent }</TableCell>
        <TableCell align="right">{ product.store }</TableCell>
        <TableCell align="right">{ product.added }</TableCell>
      </TableRow>
    })
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nimi</TableCell>
              <TableCell align="right">Outlet</TableCell>
              <TableCell align="right">Normi</TableCell>
              <TableCell align="right">Alennus</TableCell>
              <TableCell align="right">Kauppa</TableCell>
              <TableCell align="right">Lisätty</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {output}
            <TableRow><TableCell align="left">{ filtered.products.length } tuotetta</TableCell></TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <div className={classes.container}>
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Kategoria</InputLabel>
            <NativeSelect
              value={category}
              onChange={handleChange}
            >
              <option value="uusimmat">Uusimmat</option>
              <option value="kuva">Kuva</option>
              <option value="aani">Ääni</option>
              <option value="tietokoneet">Tietokoneet</option>
              <option value="puhelimet">Puhelimet ja kellot</option>
              <option>Kamera</option>
              <option>Kodinkoneet</option>
              <option>Pienkoneet</option>
              <option>Pelit ja konsolit</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="outlined-basic"
              label="Etsi..."
              variant="outlined"
              value={filter}
              onChange={handleFilterChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </Grid>
        <Grid item xs></Grid>
      </Grid>
      <br />
      <br />
      <div>
        { formatData() }
      </div>
  </Container>
  </div>
  )
}

export default App;
