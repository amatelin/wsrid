MyApp.PoeticApp.CommentList = (function() {
    var CommentList = {};

    var CommentView = Backbone.Marionette.ItemView.extend({
        template: "#comment-template",
        model: "Comment"
    });

    var ShuffleView = Backbone.View.extend({
        el: "#fetcherButton",

        events: {
            'click' : 'fetch'
        },

        fetch: function() {
            MyApp.vent.trigger("fetch");

        }
    });


    MyApp.vent.on("layout:rendered", function(){
        var shuffleView = new ShuffleView();
        MyApp.PoeticApp.layout.fetch.attachView(shuffleView);
    });



    CommentList.showComment = function(comment) {
        var commentView = new CommentView({model: comment});
        MyApp.PoeticApp.layout.comment.show(commentView);
    };



    return CommentList;
}());

MyApp.vent.on("layout:rendered", function(){
    MyApp.PoeticApp.CommentList.showComment(MyApp.PoeticApp.Comment);
});


MyApp.vent.on("fetch:complete", function(){
    MyApp.PoeticApp.CommentList.showComment(MyApp.PoeticApp.Comment);
});