const express = require('express')
const Users = require('./../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users/login', async (req, res) => {
  try{
    const user = await Users.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateToken();
    res.send({user, token} );
  }  catch(e) {
    res.status(400).send()
  }
})

router.post('/users/register', async (req, res) => {
    
    const user = new Users(req.body)
    
    try{
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logoutAl', auth, async(req, res) => {
  try{
    req.user.tokens = []
    await req.user.save()
    res.send()
  }catch(e){
    res.status(500).send()
  }
})

router.post('/users/logout', auth, async(req, res) => {
  try{
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()

    res.send()
  }catch(e){
    res.status(500).send()
  }
})

module.exports = router