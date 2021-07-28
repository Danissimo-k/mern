const { Router } = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = Router();

// api/auth/register
router.post(
  "/register",
  [
    check("email", "Неккоректный email").isEmail(),
    check("password", "Минимальная длина пароля- 8 символов.").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      console.log("Body:", req.body);
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Неккоректные данные при регистрации",
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "Такой пользователь уже существует" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: "Пользователь создан" });
    } catch (e) {
      res.status(500).json({ message: "Что-то не так" });
    }
  }
);

// api/auth/login
router.post(
  "/login",
  [
    check("email", "Неккоректный email").normalizeEmail().isEmail(),
    check("password", "Введите пароль").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Неккоректные данные при входе в учетную запись",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Такой mail не зарегистрирован" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Неверный пароль" });
      }

      const token = jwt.sign(
        {
          userId: user.id,
        },
        config.get("jwtSecret"),
        { expiresIn: "1h" }
      );
      console.log("Успех?");
    //   req.headers.authorization = token
      return res.status(200).json({ token, id: user.id });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Что-то не так", e });
    }
  }
);

module.exports = router;
