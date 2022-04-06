$("#submitnote").click((e) => {
    e.preventDefault();
    let data = {
      "author": $("#author").val(),
      "description": $("#desc").val(),
      "title": $("#title").val(),
      "body": $("#notebody").val()
    };
    let header = {
      'Authorization': `bearer ${window.localStorage.getItem('token')}`
    }
    $.ajax({
      url: "http://127.0.0.1:8000/api/note/post",
      method: "POST",
      headers: header,
      data: data,
      success: (res) => {
        alert(res)
      }
    })
  })