import './App.css'
import NavBarFixed from './layouts/NavBarFixed'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Routers from './routes/Routers';
import FooterFixed from './layouts/FooterFixed';

function App() {


  return (
    <div className=' d-flex flex-column min-vh-100'>
      <NavBarFixed />
      <Routers />
      <FooterFixed />
    </div>
  );
};

export default App
