#include "PHForm.h"
#include "http.h"
PHForm ph;

void TEST_GET(PEventHandle handle) {
	cout << "�¼������ã�" << handle->RequestData << endl;
	handle->ReseponseData = "��������ͬ��GET";
	handle->ReseponseCharset = "GBK";
}
void TEST_POST(PEventHandle handle) {
	cout << "�¼������ã�" << "Name:" << ph.SplitData(handle, 0) << "   Age:" << ph.SplitData(handle, 1) << endl;
	handle->ReseponseData = "��������ͬ��POST";
	handle->ReseponseCharset = "GBK";
}
void TEST_AGET(PEventHandle handle) {
	cout << "�¼������ã�" << handle->RequestData << endl;
	handle->ReseponseData = "���������첽GET";
	handle->ReseponseCharset = "GBK";
}
void TEST_APOST(PEventHandle handle) {
	cout << "�¼������ã�" << "Name:" << ph.SplitData(handle, 0) << "   Age:" << ph.SplitData(handle, 1) << endl;
	handle->ReseponseData = "���������첽POST";
	handle->ReseponseCharset = "GBK";
}
int times = 0;
int timess = 0;
void TEST_LGET(PEventHandle handle) {
	cout << "�¼������ã�" << handle->RequestData << endl;
	handle->ReseponseData = "��������ѭ��GET";
	handle->ReseponseData.push_back(48 + times++);
	handle->ReseponseCharset = "GBK";
	Sleep(1000);
}
void TEST_LPOST(PEventHandle handle) {
	cout << "�¼������ã�" << "Name:" << ph.SplitData(handle, 0) << "   Age:" << ph.SplitData(handle, 1) << endl;
	handle->ReseponseData = "��������ѭ��POST";
	handle->ReseponseData.push_back(48 + timess++);
	handle->ReseponseCharset = "GBK";
	Sleep(1000);
}
void TIP(PEventHandle handle) {
	handle->ReseponseData = "��ʾ��";
	handle->ReseponseCharset = "GBK";
}
void CONTENT(PEventHandle handle) {
	handle->ReseponseData = "�������ݽ���������ʾ�����ڲ��Ե���MaskID\r\n";
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