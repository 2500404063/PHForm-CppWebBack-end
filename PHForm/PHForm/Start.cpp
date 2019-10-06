#include "PHForm.h"
#include "http.h"
PHForm ph;

void TEST_GET(PEventHandle handle) {
	cout << "事件被调用：" << handle->RequestData << endl;
	handle->ReseponseData = "您测试了同步GET";
	handle->ReseponseCharset = "GBK";
}
void TEST_POST(PEventHandle handle) {
	cout << "事件被调用：" << "Name:" << ph.SplitData(handle, 0) << "   Age:" << ph.SplitData(handle, 1) << endl;
	handle->ReseponseData = "您测试了同步POST";
	handle->ReseponseCharset = "GBK";
}
void TEST_AGET(PEventHandle handle) {
	cout << "事件被调用：" << handle->RequestData << endl;
	handle->ReseponseData = "您测试了异步GET";
	handle->ReseponseCharset = "GBK";
}
void TEST_APOST(PEventHandle handle) {
	cout << "事件被调用：" << "Name:" << ph.SplitData(handle, 0) << "   Age:" << ph.SplitData(handle, 1) << endl;
	handle->ReseponseData = "您测试了异步POST";
	handle->ReseponseCharset = "GBK";
}
int times = 0;
int timess = 0;
void TEST_LGET(PEventHandle handle) {
	cout << "事件被调用：" << handle->RequestData << endl;
	handle->ReseponseData = "您测试了循环GET";
	handle->ReseponseData.push_back(48 + times++);
	handle->ReseponseCharset = "GBK";
	Sleep(1000);
}
void TEST_LPOST(PEventHandle handle) {
	cout << "事件被调用：" << "Name:" << ph.SplitData(handle, 0) << "   Age:" << ph.SplitData(handle, 1) << endl;
	handle->ReseponseData = "您测试了循环POST";
	handle->ReseponseData.push_back(48 + timess++);
	handle->ReseponseCharset = "GBK";
	Sleep(1000);
}
void TIP(PEventHandle handle) {
	handle->ReseponseData = "提示：";
	handle->ReseponseCharset = "GBK";
}
void CONTENT(PEventHandle handle) {
	handle->ReseponseData = "调试数据将会在这显示。现在测试的是MaskID\r\n";
	handle->ReseponseCharset = "GBK";
}
int main() {
	ph.Start("0.0.0.0", 1234, 100, "D:/WEB", "index.html");
	ph.AddEvent("TEST_GET", TEST_GET);
	ph.AddEvent("TEST_POST", TEST_POST);
	ph.AddEvent("TEST_AGET", TEST_AGET);
	ph.AddEvent("TEST_APOST", TEST_APOST);
	ph.AddEvent("TEST_LGET", TEST_LGET);
	ph.AddEvent("TEST_LPOST", TEST_LPOST);
	ph.AddEvent("TIP", TIP);
	ph.AddEvent("CONTENT", CONTENT);
	cin.get();
}