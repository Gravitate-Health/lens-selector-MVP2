import express from "express";
import { FocusingRouter } from "./routes/lenses";

var bodyParser = require('body-parser');

const PORT = parseInt(process.env.SERVER_PORT as string) || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }))

app.use((req, res, next) => {
    console.log(`\n\n${new Date().toLocaleString()} | Method: ${req.method} | URL: ${req.originalUrl}`);
    next()
})

app.use("/", FocusingRouter);
app.listen(PORT, () => {
    console.log(`Focusing service TEST listening on port ${PORT}`);
});
