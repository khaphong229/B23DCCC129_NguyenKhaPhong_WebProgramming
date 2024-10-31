const Course = require('../models/Course')
const { mongooseToObject } = require('../../util/mongoose')
class CourseController {
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then(course => {
                res.render('courses/show',{ course: mongooseToObject(course) })
            })
            .catch(next)
    }
    create(req, res, next){
        res.render('courses/create')
    }
    store(req, res, next){
        const course=new Course(req.body)
        course.save()
            .then(()=> res.redirect('/'))
            .catch(error => {

            })
    }
    update(req, res, next){
        Course.findById(req.params.id)
            .then(course => {
                res.render('courses/update',{
                    course: mongooseToObject(course)
                })
            })
            .catch(next)
    }
    storeUpdate(req, res, next){
        Course.updateOne({_id: req.params.id }, req.body)
            .then(() => res.redirect('/'))
            .catch(next)
    }
    delete(req, res, next){
        Course.delete({_id: req.params.id})
            .then(()=> {
                res.redirect('/')
            })
            .catch(next)
    }
    restore(req, res, next){
        Course.restore({_id: req.params.id})
            .then(()=> {
                res.redirect('/')
            })
            .catch(next)
    }
}
module.exports = new CourseController();
