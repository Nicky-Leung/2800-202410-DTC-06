
const express = require('express')
const router = express.Router();


router.get('/index.js', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'your-js-file.js'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      const replacedData = data.replace('process.env.MapKey', JSON.stringify(process.env.MapKey));
      res.type('.js');
      res.send(replacedData);
    });
  });

  module.exports = router; 
  