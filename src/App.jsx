import './App.css';
import ApiEndpoint from './components/ApiEndpoint';
import { apiEndpoints } from './data/apiData';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Uber Guest Trips API Documentation</h1>
        <p className="subtitle">Interactive API explorer for Uber guest trip management</p>
      </header>

      <main className="api-list">
        {apiEndpoints.map((api) => (
          <ApiEndpoint
            key={api.id}
            method={api.method}
            endpoint={api.endpoint}
            description={api.description}
            requestPayload={api.requestPayload}
            responsePayload={api.responsePayload}
          />
        ))}
      </main>

      <footer className="app-footer">
        <p>Built for experimentation</p>
      </footer>
    </div>
  );
}

export default App;
