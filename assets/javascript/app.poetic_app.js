MyApp.PoeticApp = (function() {
    var PoeticApp = {};

    var Layout = Backbone.Marionette.Layout.extend({
        template: "#commentDisplay-layout",

        regions: {
            fetch: "#fetcherButton",
            comment: "#commentContainer"
        }
    });

    var Comment = Backbone.Model.extend({
        model: Comment,

        defaults: {
            CommentContent: "Click me to unravel the romantic wonders of the Interweb !!!"
        },

        initialize: function(){
            var self = this;
            _.bindAll(this, "fetch");
            MyApp.vent.on("fetch", function(){
                self.fetch(function(comment){
                    MyApp.PoeticApp.Comment = comment;
                    MyApp.vent.trigger('fetch:complete');

                });
                self.reset(comment);
            });
        },


        fetch : function(callback) {
            $.getJSON(
                'http://query.yahooapis.com/v1/public/yql?callback=?',
                {
                    q: 'select * from html where url="www.redtube.com/mostviewed?period=alltime" and xpath="//*[@class=\'s\']"',
                    format: 'json'
                },
                function(data) {
                    var results = data.query.results.a;
                    var randomVid = Math.floor((Math.random()*30)+1);
                    var toStore = '';

                    $.getJSON(
                        'http://query.yahooapis.com/v1/public/yql?callback=?',
                        {
                            q: 'select * from html where url="www.redtube.com'+results[randomVid].href+'" and xpath="//*[@class=\'commentContent\']"',
                            format: 'json'
                        },
                        function(data) {
                            var results = data.query.results.p;
                            var nbrComments = results.length;
                            var randomComment = Math.floor((Math.random()*nbrComments)+1);
                            toStore = results[randomComment].span.content;
                            comment = new Comment({
                                CommentContent: toStore
                            });
                            callback(comment);

                        }
                    )


                }
            )
        },


    });


    PoeticApp.Comment = new Comment();

    PoeticApp.initializeLayout = function() {
        PoeticApp.layout = new Layout();

        PoeticApp.layout.on("show", function(){
           MyApp.vent.trigger("layout:rendered");
        });

        MyApp.content.show(MyApp.PoeticApp.layout);
    };

    return PoeticApp;
}());

MyApp.addInitializer(function(){
    MyApp.PoeticApp.initializeLayout();
});