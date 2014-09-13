// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

$.FollowToggle = function (el) {
  // ...

  this.$el = $(el);
  this.userId = this.$el.data('user-id')
  this.followState = this.$el.data('initial-follow-state');
  this.handleClick();
  this.render();
};

$.FollowToggle.prototype.method1 = function () {
  // ...
};

$.FollowToggle.prototype.handleClick = function () {
  this.$el.on('click', function() {
    event.preventDefault();
    this.$el.prop("disabled", true);
    if (this.followState === "following") {
      var type = "DELETE";
    } else {
      var type = "POST";
    }
    var that = this;
    debugger;
    $.ajax({
      
      url: "/users/" + that.userId + "/follow",
      type: type,
      dataType: "json",
      // dataType: $.ajax,
      data: {user_id: that.userId},
      error: function () {
        that.$el.prop("disabled", false);
      },
      success: function () { 
        that.followState = (that.followState === "following") ? "not-following" : "following";
        that.render();
        that.$el.prop("disabled", false);      
      }
    });
    
  }.bind(this));
  
  
}


$.fn.followToggle = function () {
  return this.each(function () {
    new $.FollowToggle(this);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});

$.FollowToggle.prototype.render = function () {
  if (this.followState === "following") {
    var buttonString = "Unfollow!";
  } else {
    var buttonString = "Follow!";
  }
  this.$el.text(buttonString);
    
};


$.fn.usersSearch = function () {
  return this.each(function () {
    new $.UsersSearch(this); 
  })
}

$.UsersSearch = function (el) {
  this.$el = $(el);
  this.input = this.$el.find('input').val();
  this.ul = this.$el.find('.users')
  this.$el.on('change', this.handleInput.bind(this))
}

$.UsersSearch.prototype.handleInput = function () {
  event.preventDefault();
  
  this.input = this.$el.find('input').val();
  this.$el.prop("disabled", true);

  var that = this;
  $.ajax({

    url: "/users/search",
    type: "GET",
    dataType: "json",
    // dataType: $.ajax,
    data: { query: that.input },
    // data: {user_id: that.userId},
    error: function () {
      that.$el.prop("disabled", false);
    },
    success: function (data) {
      that.renderResults(data);
    }
  });
}

$.UsersSearch.prototype.renderResults = function (data) {
  this.$el.find('.users').empty();


  data.forEach(function (user) {
    var $li =
     $("<li><a href='/users/" + user.id + "'>" + user.username + "</a></li>"); 
     $li.append('<button data-user-id=' + user.id + '></button>');
     $li.find('button').followToggle();
    this.ul.append($li);    
  }.bind(this))
  
}
