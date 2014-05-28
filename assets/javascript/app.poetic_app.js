/*
    PoeticApp Controller Class :
    Declares Layout() class and Comment() model

    Comment Model :
    Methods
        - fetch(callback())
*/

MyApp.PoeticApp = (function() {
    var PoeticApp = {};

    var Layout = Backbone.Marionette.Layout.extend({
        template: "#layout",

        regions: {
            fetch: "#button",
            comment: "#commentContainer",
            header: "#header",
            footer: "#footer"
        }
    });

    var Comment = Backbone.Model.extend({
        defaults: {
            CommentContent: "Are you ready to discover the creativity and the beauty that the users of your favorites' porn sites have to offer ?"
        },

        fetch : function(callback) {
            MyApp.vent.trigger('fetch:start')
            var randomPage = Math.floor((Math.random()*10)+1);
            $.getJSON(
                'http://query.yahooapis.com/v1/public/yql?callback=?',
                {
                    q: 'select * from html where url="http://www.pornhub.com/video?o=mv&t=a&page='+randomPage+'" and xpath="//*[@class=\'title\']/a"',
                    format: 'json'
                },
                function(data) {
                    var results = data.query.results.a;
                    var randomVid = Math.floor((Math.random()*23));
                    var toStore = '';

                    $.getJSON(
                        'http://query.yahooapis.com/v1/public/yql?callback=?',
                        {
                            q: 'select * from html where url="http://www.pornhub.com'+results[randomVid].href+'" and xpath="//*[@class=\'commentMsg\']/div/p"',
                            format: 'json'
                        },
                        function(data) {
                            var results = data.query.results.p;
                            var nbrComments = results.length - 1;
                            var randomComment = Math.floor((Math.random()*nbrComments));
                            var toStore = "";
                            var next = 0;


                            while(toStore.length<50) {
                                if (results[randomComment+next].content) {
                                    toStore = results[randomComment+next].content;
                                } else {
                                    toStore = results[randomComment+next];
                                }
                                next+=1;
                            }


                            comment = new Comment({
                                CommentContent: '"'+toStore+'"'
                            });
                            callback(comment);
                        }
                    )
                }
            )
        },
    });

/*
    Initialize controller's logic and management of events
    Class
        - Comment()
        - Layout()
    Events
        - show
        - fetch
    Triggers
        - layout:rendered
        - fetch:complete

 */
    PoeticApp.initializeLayout = function() {
        PoeticApp.Comment = new Comment();
        PoeticApp.layout = new Layout();

        PoeticApp.layout.on("show", function(){
           MyApp.vent.trigger("layout:rendered");
        });

        MyApp.vent.on("fetch", function(){
            PoeticApp.Comment.fetch(function(comment){
                MyApp.PoeticApp.Comment = comment;
                MyApp.vent.trigger('fetch:complete');
            });
        });

        MyApp.content.show(MyApp.PoeticApp.layout);

    };

    return PoeticApp;
}());

MyApp.addInitializer(function(){
    MyApp.PoeticApp.initializeLayout();
});