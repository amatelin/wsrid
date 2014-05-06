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
        model: Comment,

        defaults: {
            CommentContent: "Are you ready to discover the creativity and the beauty that the users of your favorites' porn sites have to offer ?"
        },

        reset: function() {
            var self = this;
            self.close();
        },

        initialize: function(){
        var self = this;
            //_.bindAll(this, "fetch");
            MyApp.vent.on("fetch", function(){
                self.fetch(function(comment){
                    MyApp.PoeticApp.Comment = comment;
                    MyApp.vent.trigger('fetch:complete');

                });
                self.reset();
            });
        },


        fetch : function(callback) {
            MyApp.vent.trigger('fetch:start')
            var randomPage = Math.floor((Math.random()*10)+1);
            $.getJSON(
                'http://query.yahooapis.com/v1/public/yql?callback=?',
                {
                    q: 'select * from html where url="www.redtube.com/mostviewed?period=alltime&page='+randomPage+'" and xpath="//*[@class=\'s\']"',
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
                            var nbrComments = results.length - 1;
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



    PoeticApp.initializeLayout = function() {
        PoeticApp.Comment = new Comment();
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