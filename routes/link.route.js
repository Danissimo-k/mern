const { Router } = require("express");
const shortid = require("shortid")
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')
const config = require("config");

const router = Router()

router.post('/generate', auth,async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const {from} = req.body

        const code = shortid.generate()
        // console.log(from)
        const existing = await Link.findOne({from})
        // console.log(existing)
        if (existing){
            return res.json({link: existing})
        }
        const to = baseUrl + '/t/' + code

        const link = new Link({
            code, to, from, owner: req.user.userId
        })

        await link.save()
        res.status(201).json({link})

    } catch (e) {
      console.log('/generate link route er')
      res.status(500).json({ message: "Что-то не так"});
    }
  
});


router.get('/', auth, async (req, res) => {
    try {
        // console.log('1')
        const links = await Link.find({owner: req.user.userId})
        res.json(links)
    } catch (e) {
      
      res.status(500).json({ message: "Что-то не так"});
    }
})

router.get('/:id', auth,async (req, res) => {
    try {
        console.log(2)
        const links = await Link.findById(req.params.id) 
        res.json(links)
        
    } catch (e) {
      
      res.status(500).json({ message: "Что-то не так"});
    }
})



module.exports = router