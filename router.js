const Express = require("express");
const router = Express.Router();
const dispenserController = require("./controllers/dispenser");

router.post("/create", dispenserController.createDispenser);
router.put("/:id/open", dispenserController.openDispenser);
router.put("/:id/close", dispenserController.closeDispenser);
router.get("/:id/total", dispenserController.getTotal);

module.exports = router;
