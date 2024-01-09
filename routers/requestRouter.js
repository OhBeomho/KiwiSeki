const { Router } = require("express");
const RequestWiki = require("../schemas/RequestWiki");
const Wiki = require("../schemas/Wiki");
const router = Router();

router.post("/create", async (req, res) => {
  if (!req.session.user) {
    res.render("error", { message: "로그인 후 이용 가능한 서비스입니다." });
    return;
  }

  const { title, content } = req.body;

  // TODO: Create request
});

router.get("/accpet/:requestId", async (req, res) => {});

router.get("/reject/:requestId", async (req, res) => {});

module.exports = router;
