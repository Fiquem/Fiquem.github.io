function load_text_from_file(file) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open ("GET", file, false);
  xmlhttp.send ();
  return xmlhttp.responseText;
}; 
