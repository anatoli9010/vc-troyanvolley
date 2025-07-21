const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

app.use(express.json());

let data = JSON.parse(fs.readFileSync('backend/data.json', 'utf8'));

app.get('/athletes', (req, res) => {
  res.json(data.athletes);
});

app.post('/pay', (req, res) => {
  const { name } = req.body;
  const athlete = data.athletes.find(a => a.name === name);
  if (athlete) {
    const now = new Date().toISOString().split('T')[0];
    athlete.history.push(now);
    sendEmail(athlete.parentEmail, `Платена такса за ${name}`, `Таксата за ${name} е платена на ${now}.`);
    fs.writeFileSync('backend/data.json', JSON.stringify(data, null, 2));
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Не е намерен състезател' });
});

function sendEmail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_app_password'
    }
  });

  transporter.sendMail({ from: 'your_email@gmail.com', to, subject, text });
}

app.listen(PORT, () => console.log(`Сървърът работи на порт ${PORT}`));
