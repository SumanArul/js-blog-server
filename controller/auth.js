const bcrypt = require("bcrypt");
const pool = require("../db.connection");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, username, password, firstname, lastname, phoneNumber } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "standard";
    const isActive = true;
    const query = `
      INSERT INTO js_blog.User
      (email, username, password, firstname, lastname, phoneNumber, role, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    pool.query(
      query,
      [
        email,
        username,
        hashedPassword,
        firstname,
        lastname,
        phoneNumber,
        role,
        isActive,
      ],
      (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          return res
            .status(500)
            .json({ error, message: "Internal Server Error" });
        }
        
        return res.status(200).json({ message: "User registered successfully"});

          //res.status(200).json({ success: true, token,user,username });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    const query = `
        SELECT id, email, password
        FROM js_blog.User
        WHERE email = ?;
      `;

    pool.query(query, [email], async (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = results[0];
     
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({ success: true, token,user });
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
