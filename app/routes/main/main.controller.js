//@ts-check

const authHelper = require('../../authHelper');


/**
 * Main Route Contoller
 * @param {object} router
 */
module.exports = (router) => {
    router.get("/",
        /**
         * @param {object} req
         * @param {object} res
         */
        (req, res) => {
            const data = {
                title: "Outlook calendar (Node, Express.js, Vue.js)",
                signinUrl: authHelper.getAuthUrl(),
            };
            req.vueOptions.head.title = "Outlook Calendar";
            res.renderVue("main/main.vue", data, req.vueOptions);
        },
    );
};
