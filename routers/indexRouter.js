const { Router } = require("express");
const Wiki = require("../schemas/Wiki");
const User = require("../schemas/User");
const RequestWiki = require("../schemas/RequestWiki");
const router = Router();
const year = 60 * 60 * 24 * 365 * 1000;

router.get("/", async (req, res) => {
  let recentEdited;
  try {
    recentEdited = await Wiki.find({ lastUpdateTime: { $gt: new Date().getTime() - year } })
      .sort([["lastUpdateTime", "desc"]])
      .populate("lastUpdateUser")
      .limit(6);
  } catch (err) {
    recentEdited = -1;
  }

  res.render("index", { recentEdited });
});

router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.render("error", { message: "사용자의 ID가 주어지지 않았습니다." });
    return;
  }

  try {
    const user = await User.findById(userId).orFail(new Error("User not found"));
    res.render("profile", { user });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});

router.get("/create", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  res.render("create");
});

router.get("/edit/:wikiId", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  const { wikiId } = req.params;

  if (!wikiId) {
    res.render("error", { message: "편집하려는 위키의 ID가 주어지지 않았습니다." });
    return;
  }

  try {
    const wiki = await Wiki.findById(wikiId).orFail(new Error("Wiki not found"));
    res.render("edit", { wiki });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

router.get("/request-edit/:requestId", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  const { requestId } = req.params;

  if (!requestId) {
    res.render("error", { message: "편집하려는 위키 요청의 ID가 주어지지 않았습니다." });
    return;
  }

  try {
    const request = await RequestWiki.findById(requestId).populate("user").orFail(new Error("Reqeust not found"));
    if (request.user.username !== req.session.user.username) {
      throw new Error("위키 요청은 요청을 만든 사람만 편집할 수 있습니다.");
    }

    res.render("requestEdit", { request });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

router.get("/view/:wikiId", async (req, res) => {
  const { wikiId } = req.params;

  if (!wikiId) {
    res.render("error", { message: "읽으려는 위키의 ID가 주어지지 않았습니다." });
    return;
  }

  try {
    const wiki = await Wiki.findById(wikiId)
      .populate(["creator", "lastUpdateUser"])
      .orFail(new Error("Wiki not found"));
    res.render("view", { wiki });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

router.get("/search", async (req, res) => {
  const { t: searchText, p: page = 1 } = req.query;

  try {
    const results = await Wiki.find(searchText ? { title: new RegExp(searchText, "i") } : {})
      .sort([["lastUpdateTime", "desc"]])
      .skip((page - 1) * 20)
      .limit(20);
    res.render("search", { results });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.render("error", { message: "로그아웃을 하던 중 에러가 발생하였습니다." });
      console.log(err);
      return;
    }

    res.render("info", { message: "로그아웃 되었습니다.", redirectUrl: "/" });
  });
});

router.get("/request-list", async (req, res) => {
  try {
    const requests = await RequestWiki.find({}).populate("user");
    res.render("requestList", { requests });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

router.get("/request-view/:requestId", async (req, res) => {
  const { requestId } = req.params;

  if (!requestId) {
    res.render("error", { message: "읽으려는 위키 요청의 ID가 주어지지 않았습니다." });
    return;
  }

  try {
    const request = await RequestWiki.findById(requestId).populate("user").orFail(new Error("Reqeust not found"));
    res.render("requestView", { request });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

module.exports = router;
