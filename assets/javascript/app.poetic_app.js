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
            return new Comment({
                CommentContent: 'GROS TEST'
            });
        },


        fetch : function() {
            $.getJSON(
                'http://query.yahooapis.com/v1/public/yql?callback=?',
                {
                    q: 'select * from html where url="www.redtube.com/mostviewed" and xpath="//*[@class=\'s\']"',
                    format: 'json'
                },
                function(data) {
                    var results = data.query.results.a;
                    var length = results.length;

                    for (var i=0; i<length; i++){
                        //console.log('select * from html where url="'+videoUrl+'" and xpath="//*[@class=\'commentContent\']"');
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
                                    console.log(results[i].span.content)
                                }

                            }
                        )
                    }
                }
            )
        },
    });

    PoeticApp.Comments = new Comments();

    PoeticApp.initializeLayout = function() {
        PoeticApp.layout = new Layout();

        MyApp.PoeticApp.Comment = PoeticApp.Comments.initialize();

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