## Aplicación Dashboard de Pokémon

Este proyecto es una aplicación de Dashboard de Pokémon desarrollada utilizando React, Material-UI y Leaflet. La aplicación permite a los usuarios iniciar sesión, ver una cuadrícula de datos con información de Pokémon y visualizar la geolocalización de cada Pokémon en un mapa.

## Características

## Sistema de Login: 
Mecanismo de inicio de sesión seguro para restringir el acceso.

## Cuadrícula de Datos: 
Muestra una lista de Pokémon con atributos como ID, Nombre, Altura, Peso, Experiencia Base y Ubicación.

## Integración con Mapas:
Representación visual de las ubicaciones de los Pokémon utilizando Leaflet.

## Operaciones CRUD: 
Permite eliminar y recuperar ubicaciones de Pokémon.

## Funcionalidad de Búsqueda: 
Buscar Pokémon por nombre.

## Paginación: 
Manejo de la paginación en la cuadrícula de datos.

## Diseño Responsivo: 
Optimizado para vistas tanto en escritorio como en dispositivos móviles.

## Requisitos Previos

Node.js (v14 o superior)
npm (v6 o superior) o Yarn

## Instalación
Clonar el repositorio:

git clone https://github.com/eduardoospino5562001/App-pokemon.git
cd pokemon-app

## Instalar las dependencias

npm install o yarn install

## Ejecutar la Aplicación
Iniciar el servidor de desarrollo:

npm start o yarn start

Abrir el navegador y navegar a http://localhost:3000.

## Estructura de Archivos

src/
components/
## Dashboard.js: 
Componente principal que muestra la cuadrícula de datos y el mapa.

## Login.js: 
Componente de inicio de sesión.

## PrivateRoute.js: 
Ruta privada que restringe el acceso a usuarios autenticados.

## AuthContext.js: 
Contexto de autenticación para manejar el estado de inicio de sesión.

## App.js:
Punto de entrada principal de la aplicación.

## index.js: 
Archivo de inicio que renderiza la aplicación.

## Dashboard.css: 
Estilos específicos para el componente de Dashboard.

## Login.css: 
Estilos específicos para el componente de Login.

public/
index.html: Archivo HTML principal.

## Descripción del Código

## Dashboard.js
El componente Dashboard se encarga de mostrar la información de los Pokémon en una cuadrícula de datos y en un mapa. Utiliza axios para obtener datos de la API de Pokémon, DataGrid de Material-UI para mostrar la cuadrícula y react-leaflet para integrar el mapa.

## Login.js
El componente Login maneja el formulario de inicio de sesión. Verifica las credenciales y, si son correctas, redirige al usuario al Dashboard.

## PrivateRoute.js
Este componente protege las rutas que requieren autenticación, redirigiendo a los usuarios no autenticados a la página de inicio de sesión.

## AuthContext.js
Maneja el estado global de autenticación, proporcionando funciones para iniciar y cerrar sesión.

## Scripts Disponibles
start: Inicia el servidor de desarrollo.
build: Construye la aplicación para producción.
test: Ejecuta las pruebas.
eject: Expone la configuración de build.











