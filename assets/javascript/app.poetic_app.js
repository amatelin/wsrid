MyApp.PoeticApp = (function() {
    var PoeticApp = {};

    var Layout = Backbone.Marionette.Layout.extend({
        template: "#commentDisplay-layout",

        regions: {
            fetch: "#fetcherButton",
            display: "#commentContainer"
        }
    });

    var Comment = Backbone.Model.extend();

    var Comments = Backbone.Collection.extend({
        model: Comment,

        initialize: function(){},

        getJSON : function(url, classToScrap, callback) {
            $.getJSON(
                'http://query.yahooapis.com/v1/public/yql?callback=?',
                {
                    q: 'select * from html where url="'+url+'" and xpath="//*[@class=\''+classToScrap+'\']"',
                    format: 'json'
                },
                function(data) {
                    callback(data);
                }
            )
        },

        fetch : function(callback) {
            var startUrl = 'http://www.redtube.com/mostviewed';

            this.getJSON(startUrl, 's', function(data) {
                callback(data.query.results);
            });

            console.log(results);

        },

            /*
            function(){
            $.getJSON(
                'http://query.yahooapis.com/v1/public/yql?callback=?',
                {
                    q: 'select * from html where url="http://www.redtube.com/mostviewed" and xpath="//*[@class=\'s\']"',
                    format: 'json'
                },
                function(data) {

                    var results = data.query.results.a;
                    var length = results.length;

                    for(var i=0; i<length; i++) {
                        console.log(results[i].href)
                    }


                }
            );
        }*/

    });

    PoeticApp.Comments = new Comments();

    PoeticApp.initializeLayout = function() {
        PoeticApp.layout = new Layout();

        PoeticApp.layout.on("show", function(){
           MyApp.vent.trigger("layout:rendered");
        });

        MyApp.content.show(MyApp.PoeticApp.layout);
    };

    MyApp.addInitializer(function(){
       PoeticApp.Comments.fetch();
    });

    return PoeticApp;
}());

MyApp.addInitializer(function(){
    MyApp.PoeticApp.initializeLayout();
});