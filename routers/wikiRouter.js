const { Router } = require("express");
const Wiki = require("../schemas/Wiki");
const User = require("../schemas/User");
const router = Router();

router.post("/edit", async (req, res) => {
  if (!req.session.user) {
    res.render("error", { message: "로그인 후 이용 가능한 서비스입니다." });
    return;
  }

  const { wikiId, content } = req.body;

  try {
    const wiki = await Wiki.findByIdAndUpdate(wikiId).orFail(new Error("Wiki not found"));
    wiki.previousContent = wiki.content;
    wiki.content = content;
    wiki.lastUpdateTime = new Date().getTime();
    wiki.lastUpdateUser = req.session.user.id;
    await wiki.save();

    await User.findByIdAndUpdate(req.session.user.id, { $inc: { editCount: 1 } });

    res.render("info", { message: `위키 '${wiki.title}'(이)가 수정되었습니다.`, redirectUrl: `/view/${wikiId}` });
  } catch (err) {
    console.log(err);
    res.render("error", { message: err.message });
  }
});

module.exports = router;
