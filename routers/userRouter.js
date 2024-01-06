const { Router } = require("express");
const User = require("../schemas/User");
const bcrypt = require("bcrypt");
const config = require("../config");
const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("error", { message: "사용자명과 비밀번호 모두 입력되어야 합니다." });
    return;
  }

  try {
    const user = await User.where({ username }).findOne().orFail(new Error("User not found"));
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    req.session.user = {
      id: user._id,
      username
    };
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("error", { message: "사용자명과 비밀번호 모두 입력되어야 합니다." });
    return;
  }

  try {
    if (await User.exists({ username })) {
      throw new Error("이미 사용된 사용자명입니다.");
    }

    const salt = await bcrypt.genSalt(Number(config.SALT_ROUNDS));
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create({
      username,
      password: passwordHash
    });

    res.redirect("/login");
  } catch (err) {
    res.render("error", { message: err.message });
  }
});

module.exports = router;
