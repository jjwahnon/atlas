import './App.css';
import Index from './pages/Index';
import logo from './logo.svg';

function App() {
  return (
    <main className="flex flex-col space-y-4 bg-slate-200">
      <header className="border-2 border-blue-400 rounded-lg bg-blue-200 content-center px-32 py-2">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Welcome to Atlas, a lookup app for all the countries in the world</h1>
        </div>
      </header>
      
      <div>
        <Index/>
      </div>
      
      <footer className="border-2 border-blue-400 rounded-lg py-6 bg-blue-200 px-4" >
        <div className="flex flex-row">
          <img src={logo} alt="react-logo" height="50" width="50"/>
          <div className="flex-col text-gray">
            <p>Author: Josh Wahnon</p>
            <br/>
            <p className="flex-row"><p>Email:</p><a href="mailto:joshwahnon@gmail.com" className="hover:text-blue-400">joshwahnon@gmail.com</a></p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
