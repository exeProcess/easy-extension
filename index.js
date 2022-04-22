
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
    let validFeilds = ['notebody','title','author']
    for (let index = 0; index < validFeilds.length; index++) {
      if($(`#${validFeilds[index]}`).val() == ""){
        $(`#${validFeilds[index]}-error`).html("This feild is required")
        $(`#${validFeilds[index]}-error`).removeClass("d-none").addClass("d-block")
        return
      }else{
        $(`#${validFeilds[index]}-error`).removeClass("d-block").addClass("d-none")
      }
    }
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
        url: "https://noteug.herokuapp.com/api/note/post",
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
              url: "https://noteug.herokuapp.com/api/note/update",
              method: "PATCH",
              headers: header,
              data: data,
              success: (res) => {
                for (let index = 0; index < validFeilds.length; index++) {
                  $(`#${validFeilds[index]}`).val("")
                }
                $("#message").html("Note updated")
                $("#message").addClass("d-block").removeClass("d-none")
              },
              error: () => {
                $("#message").html("Internal server error. try again")
                $("#message").addClass("d-block").removeClass("d-none")
              }
            })
            //alert(data.body)
          }else{
            for (let index = 0; index < validFeilds.length; index++) {
              $(`#${validFeilds[index]}`).val("")
            }
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
    let validFeilds = ['email','password']
    for (let index = 0; index < validFeilds.length; index++) {
      if($(`#${validFeilds[index]}`).val() == ""){
        $('#require').addClass("d-block").removeClass("d-none")
        return
      }else{
        $(`#${validFeilds[index]}-error`).removeClass("d-block").addClass("d-none")
      }
    }
    let regex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"
    let email =  $("#email").val()
    if(email.matches(regex)){
      let data = {
        email: $("#email").val(),
        password: $("#password").val()
      }
      $.ajax({
        url: "https://noteug.herokuapp.com/api/auth/login",
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
        },
        error: () => {
          $("#alert").removeClass("d-none").addClass("d-block")
        }
      })
    }else{
      $("#mailcorrect").removeClass("d-none").addClass("d-block")
      return
    }
  })
  $("#reg").click(() => {
    $("#alert").removeClass("d-block").addClass("d-none")
    $("#login-form").addClass("d-none").removeClass("d-block")
    $("#reg-form").addClass("d-block").removeClass("d-none")
  })
  $("#register").click((e)=>{
    e.preventDefault()
    let validFeilds = ['name','email','password','password-confirm']
    for (let index = 0; index < validFeilds.length; index++) {
      if($(`#${validFeilds[index]}`).val() == ""){
        $('#reg-req').addClass("d-block").removeClass("d-none")
        return
      }else{
        $('#reg-req').removeClass("d-block").addClass("d-none")
      }
    }
    let regex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"
    let email =  $("#email").val()
    if(email.matches(regex)){
    let data = {
      name: $("#name").val(),
      email: $("#email").val(),
      password: $("#password").val(),
      password_confirmation: $("#password-confirm").val()
    }
    //console.log(data);
    $.ajax({
      url: "https://noteug.herokuapp.com/api/auth/register",
      method: "POST",
      data: data,
      success: (res) => {
        if(res.message == "user created successfully"){
          $("#login-form").addClass("d-block").removeClass("d-none")
          $("#reg-form").addClass("d-none").removeClass("d-block")
        }
       // alert(res)
      }
    })
  }
  })