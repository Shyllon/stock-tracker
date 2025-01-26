const express = require('express');
const { registerUser, loginUser, getUser, updateUser, deleteUser} = require("../controllers/userController");

const router = express.Router();

router.post('/', registerUser);
router.post('/', loginUser);
router.get('/', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

