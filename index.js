const Express = require('express');
const app = new Express();
const cors = require("cors");

const PORT = 3000;
const router = require("./router");

app.use(cors());
app.use(Express.json());
app.use(router);

app.listen(PORT, (err) => {
	if (err) {
		console.log(`😞 Sorry, something went wrong! ${err}`);
	} else {
		console.log(`🚀 Server is listening on port ${PORT}!`);
	}
});
