import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {

  const countingValue = async (e) => {
    const salary = document.getElementById("salary").value;
    const employee = document.getElementById("employee").value;
    const employer = document.getElementById("employer").value;

    const response = await axios.get(`/api/calculatePPK?salary=${salary}&employee=${employee}&employer=${employer}`);
    document.getElementById("result").innerText = `Całowita składka przelana na konto w PPK: ${response.data}`;
  };


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <form>
            <div>
            	<label>Wynagrodzenie całkowite brutto</label>
              <input type="text'" id="salary"/>
	          </div>

	          <div>
		          <label>Wymiar składki pracownika w %</label>
		          <input type="text" id="employee"/>
	          </div>

            <div>
		          <label>Wymiar składki pracodawcy w %</label>
		          <input type="text" id="employer"/>
	          </div>
            <button type="button" onClick={countingValue}>Oblicz</button>
        </form>
	</div>
      <div id="result">
      </div>
      </header>
    </div>

  );
}

export default App;
