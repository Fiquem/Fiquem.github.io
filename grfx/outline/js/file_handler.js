function load_text_from_file(file) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open ("GET", file, false);
  xmlhttp.send ();
  return xmlhttp.responseText;
}; 

// fucking hell I spent YEARS trying to google this and almost had it god damn antom shoulda checked your repo earlier
