const { Router } = require("express");
const RequestWiki = require("../schemas/RequestWiki");
const Wiki = require("../schemas/Wiki");
const User = require("../schemas/User");
const router = Router();

router.post("/", async (req, res) => {
  if (!req.session.user) {
    res.render("error", { message: "로그인 후 이용해 주세요." });
    return;
  }

  const { title, content } = req.body;

  await RequestWiki.create({
    title,
    content,
    user: req.session.user.id
  });

  res.render("info", { message: `새로운 위키 '${title}'에 대한 요청이 등록되었습니다.`, redirectUrl: "/" });
});

router.post("/edit", async (req, res) => {
  if (!req.session.user) {
    res.render("error", { message: "로그인 후 이용해 주세요." });
    return;
  }

  const { requestId, content } = req.body;

  try {
    const request = await RequestWiki.findById(requestId).orFail(new Error("Request not found"));
    request.content = content;

    await request.save();

    res.render("info", { message: "위키 요청이 수정되었습니다.", redirectUrl: `/request-view/${requestId}` });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

router.get("/accept/:requestId", async (req, res) => {
  if (!req.session.user || req.session.user.username !== "admin") {
    res.render("error", { message: "관리자만 가능합니다." });
    return;
  }

  const { requestId } = req.params;

  if (!requestId) {
    res.render("error", { message: "위키 요청의 ID가 주어지지 않았습니다." });
    return;
  }

  try {
    const {
      title,
      content,
      user: userId
    } = await RequestWiki.findById(requestId).orFail(new Error("Request not found"));
    const now = new Date().getTime();

    const { _id: wikiId } = await Wiki.create({
      title,
      content,
      creator: userId,
      createdTime: now,
      lastUpdateUser: req.session.user.id,
      lastUpdateTime: now
    });
    await User.findByIdAndUpdate(userId, { $inc: { wikiCount: 1 } });

    await RequestWiki.findByIdAndDelete(requestId);

    res.render("info", { message: `위키 '${title}'에 대한 요청이 수락되었습니다.`, redirectUrl: `/view/${wikiId}` });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

router.get("/reject/:requestId", async (req, res) => {
  if (!req.session.user || req.session.user.username !== "admin") {
    res.render("error", { message: "관리자만 가능합니다." });
    return;
  }

  const { requestId } = req.params;

  if (!requestId) {
    res.render("error", { message: "위키 요청의 ID가 주어지지 않았습니다." });
    return;
  }

  try {
    await RequestWiki.findByIdAndDelete(requestId).orFail(new Error("Request not found"));

    res.render("info", { message: `위키 '${title}'에 대한 요청이 거부되었습니다.`, redirectUrl: `/request-list` });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

module.exports = router;
