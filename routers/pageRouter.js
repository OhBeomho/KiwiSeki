const { Router } = require("express");
const User = require("../schemas/User");
const router = Router({ caseSensitive: false });

router.get("/", (req, res) => {
  // TODO: Get 5 recent edited wiki

  res.render("index");
});

router.get("/profile/:username", async (req, res) => {
  const { username } = req.params;

  if (!username) {
    res.render("error", { message: "사용자명이 주어지지 않았습니다." });
    return;
  }

  try {
    const user = await User.where({ username }).findOne().orFail(new Error("User not found"));
    res.render("profile", { user });
  } catch (err) {
    res.render("error", { message: err.message });
    return;
  }
});

export default router;
