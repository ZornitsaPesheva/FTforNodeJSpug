const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, json) => {
    if (err) {
      console.log(err);
    } else {
        res.render('index', { json });
    }
  });
});

app.post('/', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let nodes = JSON.parse(data);
      req.body.addNodesData.forEach(node => {
        nodes.push(node);
      });
      req.body.updateNodesData.forEach(node => {
        const index = nodes.findIndex((n) => n.id === node.id);
        nodes[index] = node;
      });
      nodes = nodes.filter((node) => node.id !== req.body.removeNodeId);
      fs.writeFile('./db.json', JSON.stringify(nodes), {flag:'w'}, (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send(nodes);
        }
      });
    }
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));