MyApp.PoeticApp.CommentList = (function() {
    var CommentList = {};

    var CommentView = Backbone.Marionette.ItemView.extend({
        template: "#comment-template",
        model: "Comment"
    });

    var FetcherView = Backbone.Marionette.ItemView.extend({
        template: "#first-button-template",

        events: {
            'click' : 'fetch'
        },

        fetch: function() {
            MyApp.vent.trigger("fetch");

        }
    });

    var NewFetcherView = Backbone.Marionette.ItemView.extend({
       template: "#second-button-template",

        events: {
            'click' : 'fetch'
        },

        fetch: function() {
            MyApp.vent.trigger("fetch");

        }
    });


    CommentList.showComment = function(comment) {
        var commentView = new CommentView({model: comment});
        MyApp.PoeticApp.layout.comment.show(commentView);

    };

    CommentList.showFetcher = function() {
        var fetcherView = new FetcherView();
        MyApp.PoeticApp.layout.fetch.show(fetcherView);
    }

    CommentList.closeFetcher = function() {
        var newFetcherView = new NewFetcherView();
        MyApp.PoeticApp.layout.fetch.show(newFetcherView);
    }



    return CommentList;
}());

MyApp.vent.on("layout:rendered", function(){
    MyApp.PoeticApp.CommentList.showComment(MyApp.PoeticApp.Comment);
    MyApp.PoeticApp.CommentList.showFetcher();
});


MyApp.vent.on("fetch:complete", function(){
    MyApp.PoeticApp.CommentList.showComment(MyApp.PoeticApp.Comment);
    MyApp.PoeticApp.CommentList.closeFetcher();
});