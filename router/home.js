const router = require('express').Router();
const home = require('../controller/Home');

/* GET home page. */
router.get('/', home.index);
router.post('/', home.indexPost);
router.get('/company', home.company);
router.get('/organization', home.organization);
router.get('/hire', home.hire);
router.post('/hire', home.hireNewSuggest);
router.post('/changeSuggest', home.changeSuggest);
router.post('/changeInterview', home.changeInterview);
router.get('/salary', home.salary);
router.get('/workerChange', home.workerChange);
router.get('/risk', home.risk);
router.get('/admin', home.admin);
router.get('/affair', home.affair);
router.get('/affair/:id', home.affairInfo);
router.post('/affair/:id', home.createList);

module.exports = router;
