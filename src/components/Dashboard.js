import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Dashboard.css'; 
import L from 'leaflet';
import CircularProgress from '@mui/material/CircularProgress'; 
import TextField from '@mui/material/TextField'; 
import Button from '@mui/material/Button'; 
import { useSnackbar } from 'notistack'; 
import Dialog from '@mui/material/Dialog'; 
import DialogActions from '@mui/material/DialogActions'; 
import DialogContent from '@mui/material/DialogContent'; 
import DialogTitle from '@mui/material/DialogTitle'; 
import Grid from '@mui/material/Grid'; 

//icono personalizado para los marcadores de Leaflet
const customIcon = new L.Icon({
  iconUrl: '/maps-and-flags.png', 
  iconSize: [38, 50], // Ajusta el tamaño del icono
  iconAnchor: [19, 50],
  popupAnchor: [0, -50],
  shadowUrl: '/marker-shadow.png', 
  shadowSize: [50, 64],
  shadowAnchor: [19, 64]
});

// Generar ubicaciones aleatorias dentro de un rango específico
const generateRandomLocation = () => {
  const lat = 51.505 + Math.random() * 0.1 - 0.05;
  const lng = -0.09 + Math.random() * 0.1 - 0.05;
  return { lat, lng };
};

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar(); // Usar useSnackbar para notificaciones
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false); 
  const [currentEditRow, setCurrentEditRow] = useState(null); 
  const [newLat, setNewLat] = useState(''); // Estado para la nueva latitud
  const [newLng, setNewLng] = useState(''); // Estado para la nueva longitud
  const [error, setError] = useState(null); // Estado para manejar errores
  const [searchText, setSearchText] = useState(''); // Estado para la barra de búsqueda
  const [pageSize, setPageSize] = useState(10); // Estado para la paginación

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setCurrentEditRow(null);
    setNewLat('');
    setNewLng('');
  };

  const handleEditSave = () => {
    const updatedRows = rows.map((row) => {
      if (row.id === currentEditRow.id) {
        return {
          ...row,
          location: `(${newLat}, ${newLng})`,
          position: [parseFloat(newLat), parseFloat(newLng)],
        };
      }
      return row;
    });

    const updatedMarkers = markers.map((marker) => {
      if (marker.id === currentEditRow.id) {
        return {
          ...marker,
          location: `(${newLat}, ${newLng})`,
          position: [parseFloat(newLat), parseFloat(newLng)],
        };
      }
      return marker;
    });

    setRows(updatedRows);
    setMarkers(updatedMarkers);
    localStorage.setItem('pokemonData', JSON.stringify(updatedRows));
    enqueueSnackbar('Ubicación actualizada con éxito', { variant: 'success' });
    handleEditClose();
  };

  const fetchPokemonData = async () => {
    try {
      console.log('Fetching Pokémon data...');
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0');
      console.log('Response from PokeAPI:', response.data);
      const allPokemon = response.data.results;

      // Obtener información adicional para cada Pokémon
      const detailedPokemonData = await Promise.all(
        allPokemon.map(async (pokemon, index) => {
          const pokemonDetails = await axios.get(pokemon.url);
          console.log(`Details for ${pokemon.name}:`, pokemonDetails.data);
          const location = generateRandomLocation(); // Generar ubicaciones aleatorias
          return {
            id: index + 1, // ID numérico
            name: pokemon.name,
            height: pokemonDetails.data.height,
            weight: pokemonDetails.data.weight,
            base_experience: pokemonDetails.data.base_experience,
            location: `(${location.lat.toFixed(5)}, ${location.lng.toFixed(5)})`,
            position: [location.lat, location.lng],
          };
        })
      );

      console.log('Detailed Pokemon Data:', detailedPokemonData);

      setRows(detailedPokemonData);
      setMarkers(detailedPokemonData);
      localStorage.setItem('pokemonData', JSON.stringify(detailedPokemonData));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      setError('Error al obtener datos de Pokémon');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Clearing cached data...');
        localStorage.removeItem('pokemonData');
        localStorage.removeItem('lastFetchTime');

        console.log('Fetching new data...');
        await fetchPokemonData();
      } catch (fetchError) {
        console.error('Error during data fetch:', fetchError);
        setError('Error al obtener datos de la API');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(searchText.toLowerCase()));

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'height', headerName: 'Altura', flex: 1 },
    { field: 'weight', headerName: 'Peso', flex: 1 },
    { field: 'base_experience', headerName: 'Experiencia Base', flex: 1 },
    { field: 'location', headerName: 'Ubicación', flex: 2 }
  ];

  return (
    <div className="dashboard">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className="data-grid-container">
            <h2>Panel de Control</h2>
            <TextField 
              label="Buscar Pokémon" 
              variant="outlined" 
              fullWidth 
              value={searchText}
              onChange={handleSearch}
              style={{ marginBottom: '10px' }}
            />
            {loading ? (
              <CircularProgress /> 
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 20]}
                pagination
                autoHeight
              />
            )}
            <button onClick={logout} className="logout-button">Cerrar Sesión</button>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="map-container">
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '500px', width: '600px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers.map(marker => (
                <Marker 
                  key={marker.id} 
                  position={marker.position} 
                  icon={customIcon}
                >
                  <Popup>{marker.name}<br />{marker.location}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Grid>
      </Grid>
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Editar Ubicación</DialogTitle>
        <DialogContent>
          <TextField
            label="Latitud"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newLat}
            onChange={(e) => setNewLat(e.target.value)}
          />
          <TextField
            label="Longitud"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newLng}
            onChange={(e) => setNewLng(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard;
