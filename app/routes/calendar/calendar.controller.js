//@ts-check

const authHelper = require('../../authHelper');
const outlook = require('node-outlook');
const moment = require('moment');


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
                title: "Nodejs, Express.js, Vue.js",
                signinUrl: authHelper.getAuthUrl(),
            };
            req.vueOptions.head.title = "Outlook Calendar";
            res.renderVue("calendar/calendar.vue", data, req.vueOptions);
        },
    );

    router.get("/sync",
        /**
         * @param {object} req
         * @param {object} res
         */
        (req, res) => {
            var token = req.session.access_token;
            var email = req.session.email;

            if (token === undefined || email === undefined) {
                console.log('/sync called while not logged in');
                res.redirect('/');
                return;
            }

          // Set the endpoint to API v2
          outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
          // Set the user's email as the anchor mailbox
          outlook.base.setAnchorMailbox(req.session.email);
          // Set the preferred time zone
          outlook.base.setPreferredTimeZone('Eastern Standard Time');
          
          // Use the syncUrl if available
          var requestUrl = req.session.syncUrl;
          if (requestUrl === undefined) {
            // Calendar sync works on the CalendarView endpoint
            requestUrl = outlook.base.apiEndpoint() + '/Me/CalendarView';
          }
          
          // Set up our sync window from midnight on the current day to
          // midnight 7 days from now.
          var startDate = moment().startOf('day');
          var endDate = moment(startDate).add(7, 'days');
          // The start and end date are passed as query parameters
          var params = {
            startDateTime: startDate.toISOString(),
            endDateTime: endDate.toISOString()
          };
          
          // Set the required headers for sync
          var headers = {
            Prefer: [ 
              // Enables sync functionality
              'odata.track-changes',
              // Requests only 5 changes per response
              'odata.maxpagesize=5'
            ]
          };
          var apiOptions = {
            url: requestUrl,
            token: token,
            headers: headers,
            query: params
          };
          outlook.base.makeApiCall(apiOptions, function(error, response) {
            console.log(response);
            if (error) {
              console.log(JSON.stringify(error));
              res.send(JSON.stringify(error));
            }
            else {
              if (response.statusCode !== 200) {
                console.log('API Call returned ' + response.statusCode);
                res.send('API Call returned ' + response.statusCode);
              }
              else {
                var nextLink = response.body['@odata.nextLink'];
                if (nextLink !== undefined) {
                  req.session.syncUrl = nextLink;
                }
                var deltaLink = response.body['@odata.deltaLink'];
                if (deltaLink !== undefined) {
                  req.session.syncUrl = deltaLink;
                }

                const data = {
                    title: "Calendar events",
                    data: response.body.value,
                    email: email
                };
                req.vueOptions.head.title = "Outlook Calendar";
                res.renderVue("calendar/calendar.vue", data, req.vueOptions);
              }
            }
    });


        },//end sync
        );
    
    router.get("/viewitem",
        /**
         * @param {object} req
         * @param {object} res
         */
        (req, res) => {
               var itemId = req.query.id;
              var access_token = req.session.access_token;
              var email = req.session.email;
            
              if (itemId === undefined || access_token === undefined) {
                res.redirect('/');
                return;
              }
              
              var select = {
                '$select': 'Subject,Attendees,Location,Start,End,IsReminderOn,ReminderMinutesBeforeStart'
              };
              
              var getEventParameters = {
                token: access_token,
                eventId: itemId,
                odataParams: select
              };
              
              outlook.calendar.getEvent(getEventParameters, function(error, event) {
                if (error) {
                  console.log(error);
                  res.send(error);
                }
                else {

                if(req.query.updated == "complete"){
                    var title = 'Succesfully updated';
                }else{
                    var title = 'View Event';
                }

                 const data = {
                    title: title,
                    event: event,
                    email: email
                };

                const vueOptions = {
                    head: {
                        title: 'Outlook Calendar',
                        scripts: [
                            { src: 'https://unpkg.com/element-ui/lib/index.js' },
                        ],
                        styles: [
                            { style: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css' }
                        ]
                    }
                };
                console.log("xcz<xczczxczxczxc");
                console.log(event);
                req.vueOptions.head.title = "Outlook Calendar";
                res.renderVue("calendar/edit_event.vue", data, vueOptions);
                }
              });

        },
    );

        router.get("/updateitem",
        /**
         * @param {object} req
         * @param {object} res
         */
        (req, res) => {
                var itemId = req.query.eventId;
                  var access_token = req.session.access_token;
                  
                  if (itemId === undefined || access_token === undefined) {
                    res.redirect('/');
                    return;
                  }
                  
                  var newSubject = req.query.subject;
                  var newLocation = req.query.location;
                  var newStart = new Date(req.query.newStart).toISOString();
                  var newEnd = new Date(req.query.newEnd).toISOString();
                  
                  console.log('UPDATED SUBJECT: ', newSubject);
                  console.log('UPDATED LOCATION: ', newLocation);
                  console.log('UPDATED Start date: ', newStart);
                  console.log('UPDATED End date: ', newEnd);
                  
                  var updatePayload = {
                    Subject: newSubject,
                    Location: {
                      DisplayName: newLocation
                    },
                    Start: {
                        DateTime: newStart,
                        TimeZone: 'Eastern Standard Time'
                    },
                    End: {
                        DateTime: newEnd,
                        TimeZone: 'Eastern Standard Time'
                    }
                  };
                  
                  var updateEventParameters = {
                    token: access_token,
                    eventId: itemId,
                    update: updatePayload
                  };
                  
                  outlook.calendar.updateEvent(updateEventParameters, function(error, event) {
                    if (error) {
                      console.log(error);
                      res.send(error);
                    }
                    else {

                    res.redirect("/viewitem?updated=complete&id="+itemId);

                    }

                    });


        },
    );

           router.get("/deleteitem",
        /**
         * @param {object} req
         * @param {object} res
         */
        (req, res) => {
              var itemId = req.query.id;
              var access_token = req.session.access_token;
              
              if (itemId === undefined || access_token === undefined) {
                res.redirect('/');
                return;
              }
              
              var deleteEventParameters = {
                token: access_token,
                eventId: itemId
              };
              
              outlook.calendar.deleteEvent(deleteEventParameters, function(error, event) {
                if (error) {
                  console.log(error);
                  res.send(error);
                }
                else {
                  res.redirect('/sync');
                }
              });

        },
    );

        router.get("/createEvent",
        /**
         * @param {object} req
         * @param {object} res
         */
        (req, res) => {
             var access_token = req.session.access_token;
              
              if (access_token === undefined) {
                res.redirect('/');
                return;
              }

            const data = {
              title: "Create Event",
            };

          const vueOptions = {
            head: {
              title: 'Outlook Calendar',
              scripts: [
                { src: 'https://unpkg.com/element-ui/lib/index.js' },
              ],
              styles: [
                { style: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css' }
              ]
            }
          };
          
          res.renderVue("calendar/create_event.vue", data, vueOptions);

        },
    );
        router.get("/createItem",
        /**
         * @param {object} req
         * @param {object} res
         */
        (req, res) => {

          
          var access_token = req.session.access_token;
          if ( access_token === undefined) {
            res.redirect('/');
            return;
          }

          var newSubject = req.query.subject;
          var newLocation = req.query.location;
          var newStart = new Date(req.query.newStart).toISOString();
          var newEnd = new Date(req.query.newEnd).toISOString();

          console.log('CREATED SUBJECT: ', newSubject);
          console.log('CREATED LOCATION: ', newLocation);
          console.log('CREATED Start date: ', newStart);
          console.log('CREATED End date: ', newEnd);

          var updatePayload = {
            Subject: newSubject,
            Location: {
              DisplayName: newLocation
            },
            Start: {
              DateTime: "2018-08-06T18:00:00",
              TimeZone: 'Eastern Standard Time'
            },
            End: {
              DateTime: "2018-08-07T18:00:00",
              TimeZone: 'Eastern Standard Time'
            }
          };

      var newEvent = {
           "Subject": "Discuss the Calendar REST API",
           "Body": {
        "ContentType": "HTML",
             "Content": "I think it will meet our requirements!"
      },
    "Start": {
    "DateTime": "2018-08-06T18:00:00",
    "TimeZone": "Eastern Standard Time"
             },
    "End": {
    "DateTime": "2018-08-07T19:00:00",
    "TimeZone": "Eastern Standard Time"
             },
    "Attendees": [
    {
                 "EmailAddress": {
            "Address": "allieb@contoso.com",
                   "Name": "Allie Bellew"
          },
    "Type": "Required"
             }
      ]
    };
    
      /*    var updateEventParameters = {
            token: accesss_token,
            event: newEvent,
            email: 'vhs92@hotmail.com'
          };*/
          var userInfo = {
            email: 'vhs92@hotmail.com'
    };
   

          outlook.calendar.createEvent({ token: access_token, event: newEvent, user: userInfo },
    function (error, result) {
        if (error) {
    console.log('createEvent returned an error: ' + error);
        }
        else if (result) {

          console.log("CREATED");
          res.redirect("/logincomplete");

        }
      });
    
    
          /*outlook.calendar.createEvent(updateEventParameters, function (error) {
            if (error) {
              console.log(error);
              res.send(error);
            }
            else {
              console.log("CREATED");
              res.redirect("/logincomplete");

            }

          });*/


        },
    );




};
