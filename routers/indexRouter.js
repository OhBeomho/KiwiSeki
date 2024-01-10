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
      .sort([["lastUpdateTime", -1]])
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

router.get("/view/:wikiId", async (req, res) => {
  const { wikiId } = req.params;

  if (!wikiId) {
    res.render("error", { message: "읽으려는 위키의 ID가 주어지지 않았습니다." });
    return;
  }

  try {
    const wiki = await Wiki.findById(wikiId).orFail(new Error("Wiki not found"));
    res.render("view", { wiki });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

router.get("/search", async (req, res) => {
  const { t: searchText, p: page } = req.query;

  try {
    const result = await Wiki.find({ title: new RegExp(searchText, "i") })
      .skip((page - 1) * 20)
      .limit(20);
    res.render("search", { result });
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
  if (!req.session.user || req.session.user.username !== "admin") {
    res.render("error", { message: "관리자만 볼 수 있는 페이지입니다." });
    return;
  }

  try {
    const requests = await RequestWiki.find({});
    res.render("requestList", { requests });
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

module.exports = router;
