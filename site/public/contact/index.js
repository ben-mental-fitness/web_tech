"use strict";
// Detect sql https://larrysteinle.com/2011/02/20/use-regular-expressions-to-detect-sql-code-injection/


// Check that object is correct length
function verify_name_subject_message(object) {
  if (object.value.length >= object.minLength & object.value.length <= object.maxLength) {
    object.style.border = '1px solid #00FFFF';
    return true;
  }

  object.style.border = '1px solid red';
  return false;
}

// Check that email is valid and not sql
// Source https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/web_tests/fast/forms/resources/ValidityState-typeMismatch-email.js?q=ValidityState-typeMismatch-email.js&ss=chromium&originalUrl=https:%2F%2Fcs.chromium.org%2Fchromium%2Fsrc%2Fthird_party%2Fblink%2Fweb_tests%2Ffast%2Fforms%2Fresources%2FValidityState-typeMismatch-email.js
function verify_email(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email.value) & email.value.length >= email.minLength & email.value.length <= email.maxLength) {
      document.getElementById("contact-email").style.border = '1px solid #00FFFF';
      return true;
  }

  document.getElementById("contact-email").style.border = '1px solid red';
  return false;
}

// ON SUBMIT FORM
function submit_form() {
  var name = document.getElementById("contact-name");
  var email = document.getElementById("contact-email");
  var subject = document.getElementById("contact-subject");
  var message = document.getElementById("contact-body");

  if (!verify_name_subject_message(name)) return;
  if (!verify_email(email)) return;
  if (!verify_name_subject_message(subject)) return;
  if (!verify_name_subject_message(message)) return;

  const content_str = "name=" + name.value + '&email=' + email.value + '&subject=' + subject.value + '&message=' + message.value;
  fetch( "/contact/?submit", {
    method: 'POST',
    headers: {'Content-Type': 'text/plain'},
    body: content_str
  }).then(handle);
}

// Handle response
function handle(response) {
  var s = response.status;
  if (s == 200) {
    document.getElementById("contact_submit").innerHTML = "Message Sent.";
    document.getElementById("contact_submit").disabled = true;
  } else {
    document.getElementById("contact_submit").innerHTML = "Message not sent. Click to try again."
  }
}

// ON FORM TYPE
function count_length() {
  var lab = document.getElementById("contact-body-label");
  var message = document.getElementById("contact-body").value;
  lab.innerHTML = "Your message (" + message.length + " / 280 characters)";
}
