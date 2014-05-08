/*
    ManageViews class :
    Methods
        - showLoader()
        - showComment(Comment comment)
        - showFetcher()
        - changeFetcher()
   Views
        - LoaderView
        - CommentView
        - FirstFetcherView
        - SecondFetcherView

 */
MyApp.PoeticApp.ManageViews = (function() {
    var ManageViews = {};

    var LoaderView = Backbone.Marionette.ItemView.extend({
       template: "#loader-template"
    });

    var CommentView = Backbone.Marionette.ItemView.extend({
        template: "#comment-template",
        model: "Comment"
    });

    var FirstFetcherView = Backbone.Marionette.ItemView.extend({
        template: "#first-fetcher-template",

        events: {
            'click' : 'fetch'
        },

        fetch: function() {
            MyApp.vent.trigger("fetch");

        }
    });

    var SecondFetcherView = Backbone.Marionette.ItemView.extend({
       template: "#second-fetcher-template",

        events: {
            'click' : 'fetch'
        },

        fetch: function() {
            MyApp.vent.trigger("fetch");

        }
    });

    ManageViews.showLoader = function() {
        var loaderView = new LoaderView();
        MyApp.PoeticApp.layout.comment.show(loaderView);
    };

    ManageViews.showComment = function(comment) {
        var commentView = new CommentView({model: comment});
        MyApp.PoeticApp.layout.comment.show(commentView);

    };

    ManageViews.showFetcher = function() {
        var fetcherView = new FirstFetcherView();
        MyApp.PoeticApp.layout.fetch.show(fetcherView);
    }

    ManageViews.changeFetcher = function() {
        var fetcherView = new SecondFetcherView();
        MyApp.PoeticApp.layout.fetch.show(fetcherView);
    }


    return ManageViews;
}());


/*
    Event Management :
    Events
        - layout:rendered
        - fetch:start
        - fetch:complete
 */
MyApp.vent.on("layout:rendered", function(){
    MyApp.PoeticApp.ManageViews.showComment(MyApp.PoeticApp.Comment);
    MyApp.PoeticApp.ManageViews.showFetcher();
});

MyApp.vent.on("fetch:start", function(){
   MyApp.PoeticApp.ManageViews.showLoader();
});


MyApp.vent.on("fetch:complete", function(){
    MyApp.PoeticApp.ManageViews.showComment(MyApp.PoeticApp.Comment);
    MyApp.PoeticApp.ManageViews.changeFetcher();
});