
var token
chrome.storage.sync.set({'token': localStorage['token']}, function() {
  console.log('Settings saved');
});
chrome.storage.sync.get(['token'], function(items) {
  //message('Settings retrieved', items);
  token = items
});
$("#submitnote").click((e) => {
    e.preventDefault();
    if(token.token == null){
      $("#note-form").removeClass("d-block").addClass("d-none")
      $("#login-form").addClass("d-block").removeClass("d-none")
    }else{
      let data = {
        "author": $("#author").val(),
        "description": $("#desc").val(),
        "title": $("#title").val(),
        "body": $("#notebody").val()
      };
      let header = {
        'Authorization': `bearer ${token.token}`
      }
      $.ajax({
        url: "https://easy-noteapp.herokuapp.com/api/note/post",
        method: "POST",
        headers: header,
        data: data,
        success: (res) => {
          if(res.message == "update"){
            let data = {
              "author": $("#author").val(),
              "description": $("#desc").val(),
              "title": $("#title").val(),
              "body": $("#notebody").val()
            };
           $.ajax({
              url: "https://easy-noteapp.herokuapp.com/api/note/update",
              method: "PATCH",
              headers: header,
              data: data,
              success: (res) => {
                $("#message").html("Note updated")
                $("#message").addClass("d-block").removeClass("d-none")
              },
              error: () => {
                alert("error")
              }
            })
            //alert(data.body)
          }else{
            $("#message").html("Note Created")
            $("#message").addClass("d-block").removeClass("d-none")
          }
        },
        error: () => {
          $("#note-form").removeClass("d-block").addClass("d-none")
          $("#login-form").addClass("d-block").removeClass("d-none")
        }
      })
    }
  })
  $("#login").click((e) => {
    e.preventDefault();
    let data = {
      email: $("#email").val(),
      password: $("#password").val()
    }
    $.ajax({
      url: "https://easy-noteapp.herokuapp.com/api/auth/login",
      method: "POST",
      data: data,
      success: (res) => {
        chrome.storage.sync.set({'token': res.original.token}, function() {
          console.log('Settings saved');
        });
        chrome.storage.sync.get(['token'], function(items) {
          //message('Settings retrieved', items);
          token = items
        });
        $("#note-form").removeClass("d-none").addClass("d-block")
        $("#login-form").addClass("d-none").removeClass("d-block")
      }
    })
  })

  $("register").click((e)=>{
    e.preventDefault()
    let data = {
      name: $("#name").val(),
      email: $("#email").val(),
      password: $("#password").val(),
      password_confirmation: $("#password-confirm").val()
    }
    //console.log(data);
    $.ajax({
      url: "https://easy-noteapp.herokuapp.com/api/auth/register",
      method: "POST",
      data: data,
      success: (res) => {
        //window.localStorage.setItem("token", res.token);
        if(res.message == "user created successfully"){
          window.location.href = "login.html"
        }
      }
    })
  })