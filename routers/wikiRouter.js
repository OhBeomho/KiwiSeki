const { Router } = require("express");
const Wiki = require("../schemas/Wiki");
const router = Router();

router.patch("/", async (req, res) => {
  if (!req.session.user) {
    res.render("error", { message: "로그인 후 이용 가능한 서비스입니다." });
    return;
  }

  const { wikiId, title, content } = req.body;

  // TODO: edit wiki
});

module.exports = router;
