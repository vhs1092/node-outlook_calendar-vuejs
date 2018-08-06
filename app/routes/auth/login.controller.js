//@ts-check

const authHelper = require('../../authHelper');


/**
 * Main Route Contoller
 * @param {object} router
 */
module.exports = (router) => {
    router.get("/logincomplete",
        /**
         * @param {object} req
         * @param {object} res
         */
        (req, res) => {
             var access_token = req.session.access_token;
             var refresh_token = req.session.access_token;
             var email = req.session.email;

            const data = {
                title: "Successfully Login",
                email: email,
            };
            req.vueOptions.head.title = "Outlook Calendar";
            res.renderVue("auth/index.vue", data, req.vueOptions);
        },
    );
};
