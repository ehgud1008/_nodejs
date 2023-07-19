module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <h3><a href="/authorList">author</a></h3>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i].id}">${filelist[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }, authorSelect : function(authors, author_id){
    var tag = '';
    var i = 0;
    while(i < authors.length){
      var selected = '';
      if(authors[i].id === author_id){
        selected = 'selected';
      }
      tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`
      console.log(tag);
      i ++;
    }
    return `
      <select name = "author">
        ${tag}
      </select>
    `
  }, authorList : (authors) => {
    var html = '';
    for(var i = 0; i < authors.length; i++){
      html += `
        <tr>
          <th>title</th>
          <th>profile</th>
          <th>update</th>
          <th>delete</th>
        </tr>
        <tr>
          <td>${authors[i].name}</td>
          <td>${authors[i].profile}</td>
          <td><a href = "/authorUpdate?id=${authors[i].id}">update</a></td>
          <td><a href = "/authorDelete?id=${authors[i].id}">delete</a></td>
        </tr>
      `
    }
    return html;
  }
}
