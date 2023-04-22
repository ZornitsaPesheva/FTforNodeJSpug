const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
        res.render('index', { json: data });
    }
  });
});

app.post('/save', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const nodes = JSON.parse(data);
      const newNodes = req.body.newNodes;
      req.body.newNodes.forEach(node => {
        nodes.push(node);
      });
      req.body.updatedNodes.forEach(node => {
        const index = nodes.findIndex((n) => n.id === node.id);
        nodes[index] = node;
      });
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