const db = require('../../models')
const jwt = require('../../utils/jwt')

const Users = db.users

exports.login = async (req, res) => {
  Users.findOne({
    where: {
      email: req.body.email.trim(),
      password_plain: req.body.password
    },
    attributes: ['id', 'name', 'email']
  })
  .then(user => {
    const token = jwt.signToken({ userId: user.id, name: user.name, email: user.email })
    res.status(200).send({ token })
  })
  .catch(() => {
    res.status(403).send({ message: 'Incorrect Logins' })
  }) 
}
