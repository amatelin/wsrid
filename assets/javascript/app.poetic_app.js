MyApp.PoeticApp = (function() {
    var PoeticApp = {};

    var Layout = Backbone.Marionette.Layout.extend({
        template: "#commentDisplay-layout",

        regions: {
            fetch: "#fetcherButton",
            comments: "#commentContainer"
        }
    });

    var Comment = Backbone.Model.extend({
        defaults: {
            CommentContent: "DEFAULT VALUE"
        }
    });

    var Comments = Backbone.Collection.extend({
        model: Comment,

        self: this,

        initialize: function(){
            return new Comment({});
        },


        fetch : function(callback) {
            $.getJSON(
                'http://query.yahooapis.com/v1/public/yql?callback=?',
                {
                    q: 'select * from html where url="www.redtube.com/mostviewed" and xpath="//*[@class=\'s\']"',
                    format: 'json'
                },
                function(data) {
                    var results = data.query.results.a;
                    var nbrVids = results.length;
                    var randomVid = Math.floor((Math.random()*nbrVids)+1);
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
                            console.log(results[randomComment]);
                            toStore = results[randomComment].span.content;
                            //console.log(toStore);
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

    PoeticApp.Comments = new Comments();

    PoeticApp.initializeLayout = function() {
        PoeticApp.layout = new Layout();

        MyApp.PoeticApp.DefaultComment = PoeticApp.Comments.initialize();
        PoeticApp.Comments.fetch(function(comment){
            MyApp.PoeticApp.Comment = comment;
            MyApp.vent.trigger('fetch:complete');
        });

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