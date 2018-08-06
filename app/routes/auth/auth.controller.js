//@ts-check

const authHelper = require('../../authHelper');
const session = require('express-session');


/**
 * Main Route Contoller
 * @param {object} router
 */
module.exports = (router) => {
    router.get("/authorize",
        /**
         * @param {object} req
         * @param {object} res
         */
        (req, res) => {
            var authCode = req.query.code;
              if (authCode) {
                console.log('');
                console.log('Retrieved auth code in /authorize: ' + authCode);
                authHelper.getTokenFromCode(authCode, tokenReceived, req, res);
              }
              else {
                // redirect to home
                console.log('/authorize called without a code parameter, redirecting to login');
                            const data = {
                title: "Outlook calendar (Node, Express.js, Vue.js)",
                signinUrl: authHelper.getAuthUrl(),
                };
                res.renderVue("main/main.vue", data, req.vueOptions);

              }


        },
    );

    router.get("/logout",
        /**
         * @param {object} req
         * @param {object} res
         */
        (req, res) => {
            req.session.destroy();
            res.redirect('/');
        },
    );

};

//callback
function tokenReceived(req, res, error, token) {
  if (error) {
    console.log('ERROR getting token:'  + JSON.stringify(error));
    res.send('ERROR getting token: ' + JSON.stringify(error));
  }
  else {
    // save tokens in session
    req.session.access_token = token.token.access_token;
    req.session.refresh_token = token.token.refresh_token;
    req.session.email = authHelper.getEmailFromIdToken(token.token.id_token);
    res.redirect('/logincomplete');
  }
}