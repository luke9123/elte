function ujXHR() {
  var xhr = null;
  try { xhr = new XMLHttpRequest(); } catch(e) {
  try { xhr = new ActiveXObject("Msxml2.XMLHTTP"); } catch(e) {
  try { xhr = new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {
        xhr = null;
  }}}
  return xhr;
}

function ajax(opts) { 
  var mod    = opts.mod        || 'GET',
      url      = opts.url      || '',
      getadat  = opts.getadat  || '',
      postadat = opts.postadat || '',
      siker    = opts.siker    || function(){},
      hiba     = opts.hiba     || function(){};

  mod = mod.toUpperCase();
  url = url+'?'+getadat;
  var xhr = ujXHR();
  xhr.open(mod, url, true);
  if (mod === 'POST') {
    xhr.setRequestHeader('Content-Type', 
      'application/x-www-form-urlencoded');
  }
  xhr.addEventListener('readystatechange', function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        siker(xhr, xhr.responseText);
      } else {
        hiba(xhr);
      }
    }
  }, false);
  xhr.send(mod == 'POST' ? postadat : null);
  return xhr;
}

function $(selector) {
    return document.querySelector(selector);
}


window.addEventListener('load', function () {
    $('#send').addEventListener('click', function () {
        ajax({
            mod: 'POST',
            url: 'index.php',
            getadat: 'newtodo',
            postadat: 'todo=' + $('#todo').value,
            siker: function (response) {
                var data = JSON.parse(response.response);
                console.log(data);
                var todos = '';
                for (var i = 0; i < data.length; i++) {
                    todos += `<div class="alert alert-success">
                                  ${data[i].text}
                                  <button class="pull-right btn btn-info">Kész</button>
                                  <button class="pull-right btn btn-danger">Töröl</button>
                              </div>
                              `;
                }
                $('#todos').innerHTML = todos;
            },
            hiba: function () {
                alert('Sikertelen AJAX kérés!');
            }
        });
    });
});