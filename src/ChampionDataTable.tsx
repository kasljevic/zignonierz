import React from 'react';
import ChampionDataTable from 'src/ChampionDataTable.tsx';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto py-4 px-6">
          <h1 className="text-3xl font-bold">League of Legends ARAM Champion Data</h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-6">
        <ChampionDataTable />
      </main>
      <footer className="bg-gray-200 text-center py-4 mt-8">
        <p className="text-gray-600">© 2024 LoL ARAM Stats. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
