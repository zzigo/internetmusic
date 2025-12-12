// hp-B.js
function loadHpB() {
    console.log('Instrument B loaded');
    const container = document.getElementById('instrument-container');
    container.innerHTML = '<h1>Instrument B</h1>';
  
    return {
      noteOn: (note, velocity) => {
        console.log('noteOn', note, velocity);
      },
      noteOff: (note) => {
          console.log('noteOff', note);
      },
      unload: () => {
        console.log('Instrument B unloaded');
        const container = document.getElementById('instrument-container');
        container.innerHTML = '';
      }
    };
  }
  