const Course = require('../models/Course')
const { multipleMongooseToObject } = require('../../util/mongoose')
class meController {
    trash(req, res, next){
        Course.findDeleted({})
            .then((courses)=>{
                res.render('courses/trash',{
                    courses:multipleMongooseToObject(courses)
                })
            })
            .catch(next)
    }
}
module.exports = new meController();
