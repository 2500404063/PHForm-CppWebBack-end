function Run(){
    var ph = new PHForm();
    var buffer = new Object;
    ph.maskid("logout",buffer);
}
function log(text) {
    document.getElementById("logout").value += text + "\r\n";
}
function GET() {
    var ph = new PHForm();
    var result = ph.get("TEST_GET");
    log(result);
}
function POST() {
    var ph = new PHForm();
    var data = [
        ["name", "Peng"],
        ["age", "18"]
    ];
    console.log(GetPost(data));
    var result = ph.post("TEST_POST", GetPost(data));
    log(result);
}
function callback(data) {
    log(data);
}
function AGET() {
    var ph = new PHForm();
    var result = ph.aget("TEST_AGET", callback);
}
function APOST() {
    var ph = new PHForm();
    var data = [
        ["name", "Peng"],
        ["age", "18"]
    ];
    console.log(GetPost(data));
    ph.apost("TEST_APOST", GetPost(data), callback);
}
var L_GET;
function LGET() {
    var ph = new PHForm();
    L_GET = ph.lget("TEST_LGET", callback);
}
var L_POST;
function LPOST() {
    var ph = new PHForm();
    var data = [
        ["name", "Peng"],
        ["age", "18"]
    ];
    L_POST = ph.lpost("TEST_LPOST", GetPost(data), callback);
}
function CancelGET() {
    var ph = new PHForm();
    ph.lstop(L_GET);
}
function CancelPOST() {
    var ph = new PHForm();
    ph.lstop(L_POST);
}