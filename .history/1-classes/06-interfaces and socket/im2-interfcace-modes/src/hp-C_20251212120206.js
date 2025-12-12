// hp-C.js
window.loadHpC = function() {
    console.log('Instrument C loaded');
    const container = document.getElementById('instrument-container');
    container.innerHTML = '<h1>Instrument C</h1>';
  
    return {
      noteOn: (note, velocity) => {
        console.log('noteOn', note, velocity);
      },
      noteOff: (note) => {
          console.log('noteOff', note);
      },
      unload: () => {
        console.log('Instrument C unloaded');
        const container = document.getElementById('instrument-container');
        container.innerHTML = '';
      }
    };
  }
