
const ipcRenderer = window.ipcRenderer;

ipcRenderer.send('executeQuery');

ipcRenderer.on('queryResult', (event, result) => {
  const resultList = document.getElementById('result');
  result.forEach(item => {
    const listItem = document.createElement('li');
    listItem.innerText = JSON.stringify(item);
    resultList.appendChild(listItem);
  });
});

