var path = require('path');

module.exports = function (app, models) {
    var admin = require('./admin.js')(models);
    var user = require('./user.js')(models);
    var question = require('./question.js')(models);
    var zirafer = require('./zirafer.js')(models);
    var category = require('./category.js')(models);

    app.post('/admin/login', admin.login);
    app.get('/admin/isValid', admin.isValid);
    app.post('/admin/reset', admin.reset);
    app.get('/admin/get_user', admin.get_user);
    app.get('/admin/get_user_info', admin.get_user_info);
    app.get('/admin/remove_user', admin.remove_user);
    app.get('/admin/get_home', admin.get_home);
    app.post('/admin/add_home', admin.add_home);
    app.get('/admin/remove_home', admin.remove_home);

    app.post('/user/signup', user.signup);
    app.post('/user/login', user.login);
    app.post('/user/reset_password', user.reset_password);
    app.get('/user/forgot_password', user.forgot_password);
    app.post('/user/change_photo', user.change_photo);
    app.post('/user/change_profile', user.change_profile);
    app.post('/user/set_favorite', user.set_favorite);
    app.get('/user/get_favorite', user.get_favorite);
    app.get('/user/get_user_rest', user.get_user_rest);

    app.get('/question/get_questions', question.get_questions);
    app.post('/question/add_question', question.add_question);
    app.post('/question/change_question', question.change_question);
    app.get('/question/remove_question', question.remove_question);
    app.post('/question/change_user_answer', question.change_user_answer);
    app.get('/question/get_user_answers', question.get_user_answers);
    app.get('/question/get_all_user_que', question.get_all_user_que);
    app.get('/question/remove_user_que', question.remove_user_que);

    app.get('/zirafer/get_zirafers', zirafer.get_zirafers);
    app.post('/zirafer/add_zirafer', zirafer.add_zirafer);
    app.get('/zirafer/remove_zirafer', zirafer.remove_zirafer);
    app.post('/zirafer/change_zirafer_info', zirafer.change_zirafer_info);
    app.get('/zirafer/get_zirafer', zirafer.get_zirafer);
    app.post('/zirafer/submit_photo', zirafer.submit_photo);
    app.post('/zirafer/submit_review', zirafer.submit_review);
    app.get('/zirafer/remove_top', zirafer.remove_top);
    app.get('/zirafer/remove_review', zirafer.remove_review);

    app.get('/category/get_cat', category.get_cat);
    app.get('/category/get_main_cat', category.get_main_cat);
    app.get('/category/get_header_cat', category.get_header_cat);
    app.get('/category/get_sub_cat', category.get_sub_cat);
    app.post('/category/add_cat', category.add_cat);
    app.get('/category/remove_cat', category.remove_cat);
    app.post('/category/change_cat', category.change_cat);
    app.get('/category/get_rests', category.get_rests);
    app.get('/category/get_near_rests', category.get_near_rests);
    app.get('/category/get_all_rests', category.get_all_rests);
    app.post('/category/add_rest', category.add_rest);
    app.post('/category/add_photo', category.add_photo);
    app.post('/category/add_menu', category.add_menu);
    app.post('/category/change_rest_info', category.change_rest_info);
    app.get('/category/get_rest_info', category.get_rest_info);
    app.get('/category/remove_rest', category.remove_rest);
    app.delete('/category/remove_rest_image', category.remove_rest_image);
    app.put('/category/update_res_photo', category.update_res_photo);
    
    

    app.get('/upload/profile', function (req, res) {
        res.sendFile(path.resolve('./upload/profile/' + req.query.url));
    });
    app.get('/upload/category', function (req, res) {
        res.sendFile(path.resolve('./upload/category/' + req.query.url));
    });
    app.get('/upload/home', function (req, res) {
        res.sendFile(path.resolve('./upload/home/' + req.query.url));
    });
    app.get('/upload/menu', function (req, res) {
        res.sendFile(path.resolve('./upload/menu/' + req.query.url));
    });
    app.get('/upload/restaurant', function (req, res) {
        res.sendFile(path.resolve('./upload/restaurant/' + req.query.url));
    });
    app.get('/upload/zirafer', function (req, res) {
        res.sendFile(path.resolve('./upload/zirafer/' + req.query.url));
    });
    app.get('/upload/top_pick', function (req, res) {
        res.sendFile(path.resolve('./upload/top_pick/' + req.query.url));
    });
}