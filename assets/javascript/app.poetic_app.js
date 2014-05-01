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
                    var length = results.length;
                    var fetchResults = [];

                    for (var i=0; i<length; i++){
                        $.getJSON(
                            'http://query.yahooapis.com/v1/public/yql?callback=?',
                            {
                                q: 'select * from html where url="www.redtube.com'+results[i].href+'" and xpath="//*[@class=\'commentContent\']"',
                                format: 'json'
                            },
                            function(data) {
                                var results = data.query.results.p;
                                var length = results.length;

                                for (var i=0; i<length; i++) {
                                    var comment = results[i].span.content;
                                    fetchResults.push(comment);
                                }
                            }
                        )
                    }
                    callback(fetchResults);
                }
            )
        },
    });

    PoeticApp.Comments = new Comments();

    PoeticApp.initializeLayout = function() {
        PoeticApp.layout = new Layout();

        MyApp.PoeticApp.DefaultComment = PoeticApp.Comments.initialize();
        PoeticApp.Comments.fetch(function(fetchResults){
            MyApp.PoeticApp.Comments = fetchResults;
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