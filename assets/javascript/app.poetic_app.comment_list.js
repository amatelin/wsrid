MyApp.PoeticApp.CommentList = (function() {
    var CommentList = {};

    var CommentView = Backbone.Marionette.ItemView.extend({
        template: "#comment-template",
    });

    CommentList.showComment = function(comment) {
        var commentView = new CommentView({model: comment});
        MyApp.PoeticApp.layout.comments.show(commentView);
    };

    return CommentList;
}());

MyApp.vent.on("layout:rendered", function(){
   MyApp.PoeticApp.CommentList.showComment(MyApp.PoeticApp.Comment);
});