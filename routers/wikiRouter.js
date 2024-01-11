const { Router } = require("express");
const Wiki = require("../schemas/Wiki");
const router = Router();

router.patch("/", async (req, res) => {
  if (!req.session.user) {
    res.render("error", { message: "로그인 후 이용 가능한 서비스입니다." });
    return;
  }

  const { wikiId, content } = req.body;

  try {
    const wiki = await Wiki.findById(wikiId).orFail(new Error("Wiki not found"));
    wiki.content = content;
    wiki.lastUpdateTime = new Date().getTime();
    wiki.lastUpdateUser = req.session.user.id;
    await wiki.save();

    res.render("info", { message: `위키 '${title}'(이)가 수정되었습니다.`, redirectUrl: `/view/${wikiId}` });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

module.exports = router;
