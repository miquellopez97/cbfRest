const { Router } = require('express');

const router = Router();

const { 
    obtenerDatos, 
    pintarForm,
    guardarData,
    showOne,
} = require('../controllers/google.controller');

router.get('/', obtenerDatos);
router.get('/form', pintarForm);
router.post('/form', guardarData);
router.get('/jugadora/:id', showOne)

module.exports = router;