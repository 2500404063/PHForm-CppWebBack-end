#include "PHForm.h"

void PHForm::Start(const char* ip, unsigned int port, unsigned int backlog, const char* RootPath, const char* DefaultPage)
{
	httpsock.Listen(&Server, ip, port, backlog);
	thread_accepting = thread(&PHForm::accepting, this);
	thread_accepting.detach();
	thread_work = thread(&PHForm::work, this);
	thread_work.detach();
	this->DefaultPage = DefaultPage;
	this->RootPath = RootPath;
}

void PHForm::AddEvent(string signal_name, EventCall func)
{
	this->SignalName.push_back(signal_name);
	this->SignalCall.push_back(func);
}

void PHForm::DelEvent(string signal_name)
{
	for (auto i = 0; i < this->SignalName.size(); i++)
	{
		if (SignalName[i] == signal_name) {
			SignalName.erase(SignalName.cbegin() + i);
			SignalCall.erase(SignalCall.cbegin() + i);
			break;
		}
	}
}

string PHForm::SplitData(PEventHandle handle, int _Off)
{
	string Data = handle->RequestData;
	Data = Data.append("&");
	_Off++;
	if (_Off == 1) {
		size_t index = 0;
		size_t next = 0;
		next = Data.find('&', index);
		Data = Data.substr(index, next);
		size_t position = Data.find('=');
		Data = Data.substr(position + 1, Data.size() - position - 1);
		return Data;
	}
	else {
		size_t last = 0;
		size_t end = 0;
		for (int i = 1; i < _Off; i++)
		{
			last = Data.find('&', last);
			last++;
			end = Data.find('&', last);//10    15
		}
		Data = Data.substr(last, end - last);
		size_t position = Data.find('=');
		Data = Data.substr(position + 1, Data.size() - position - 1);
		return Data;
}
}

void PHForm::SetCharSet(string charset)
{
	this->CharSet = charset;
}

void PHForm::accepting() {
	while (true)
	{
		sockaddr_in eip;
		SOCKET client = httpsock.Accept(Server, &eip);
		PMoreInfo info = new MoreInfo;
		httpsock.WSASetINFO(info, client, eip, 4096);
		httpsock.WSABind(info);
		httpsock.WSARecv(info);
	}
}

void PHForm::work() {
	while (true)
	{
		WAITStatus status;
		httpsock.WSAStatus(&status, 500);
		switch (status.status)
		{
		case WAIT_STATUS::Recv: {
			thread thread_temp(&PHForm::Execution, this, httpsock.WSAGetData(status.more), status.more->mSock);
			thread_temp.detach();
			httpsock.WSASetINFO(status.more, 4096);
			httpsock.WSARecv(status.more);
			break;
		}
		case WAIT_STATUS::Send:
			break;
		case WAIT_STATUS::Left:
			httpsock.Stop_RW(status.more->mSock);
			httpsock.WSAUnBind(status.more);
			delete status.more;
			break;
		case WAIT_STATUS::Error:
			break;
		default:
			break;
		}
	}
}

void PHForm::Execution(string request, SOCKET sock) {
	if (!request.empty()) {
		//Execute url and read files;
		string url = Http_GetRequestUrl(request);
		PPHFormEvent ppe = new PHFormEvent;
		ppe->url = url;
		if (Http_GetRequestWay(request) == "GET") {
			ppe->handle.RequestData = url;
		}
		else {
			ppe->handle.RequestData = Http_GetRequestData(request);//GET is ok;
		}
		thread thread_event(&PHForm::EventsController, this, ppe);
		thread_event.detach();
		if (!url.empty()) {
			if (url == "/") {
				url = this->RootPath + "/" + this->DefaultPage;
				url = Http_DownToUp(url);
			}
			else {
				url = this->RootPath + url;
				url = Http_DownToUp(url);
			}
			//Read files;
			string file;
			string FileSize;
			streampos _FileSize;
			bool IsOpen = false;
			ifstream in(url, ios::binary);
			if (in.is_open()) {
				IsOpen = true;
				in.seekg(0, in.end);
				_FileSize = in.tellg();
				in.seekg(0, in.beg);
				//Convert file size into string
				stringstream ss;
				ss << _FileSize;
				ss >> FileSize;
				if (_FileSize > 0) {
					file.resize(_FileSize);
					in.read(&file.at(0), _FileSize);
				}
				in.close();
			}
			//Wait for event finished.
			while (true)
			{
				if (ppe->EventStatus) {
					break;
				}
			}
			//Make a response;
			string response;
			if (IsOpen) {
				if (_FileSize <= 0) {
					response.append("HTTP/1.1 204 No Content\r\n");
					response.append("Content-Type: " + Http_GetFileType(url) + ";charset=" + this->CharSet + "\r\n");
					response.append("Content-Length: " + FileSize + "\r\n");
					response.append("Server: PHForm\r\n");
					response.append("Vary: Accept-Encoding\r\n");
					response.append("\r\n");
				}
				else {
					response.append("HTTP/1.1 200 OK\r\n");
					response.append("Content-Type: " + Http_GetFileType(url) + ";charset=" + this->CharSet + "\r\n");
					response.append("Content-Length: " + FileSize + "\r\n");
					response.append("Server: PHForm\r\n");
					response.append("Vary: Accept-Encoding\r\n");
					response.append("\r\n");
					response.append(file);
				}
			}
			else if (ppe->IsSignal) {
				string BackDataSize;
				stringstream ss;
				ss << ppe->handle.ReseponseData.size();
				ss >> BackDataSize;
				response.append("HTTP/1.1 200 OK\r\n");
				response.append("Content-Type: text/plain;charset=" + ppe->handle.ReseponseCharset + "\r\n");
				response.append("Content-Length: " + BackDataSize + "\r\n");
				response.append("Server: PHForm\r\n");
				response.append("Vary: Accept-Encoding\r\n");
				response.append("\r\n");
				response.append(ppe->handle.ReseponseData);
			}
			else {
				response.append("HTTP/1.1 404 Not Found\r\n");
				response.append("Content-Type: " + Http_GetFileType(url) + ";charset=" + this->CharSet + "\r\n");
				response.append("Content-Length: 0\r\n");
				response.append("Server: PHForm\r\n");
				response.append("Vary: Accept-Encoding\r\n");
				response.append("\r\n");
			}
			httpsock.WSASend(sock, response, response.size());
			delete ppe;
		}
	}
}

void PHForm::EventsController(PPHFormEvent ppe)
{
	for (size_t i = 0; i < SignalName.size(); i++)
	{
		regex rg(SignalName[i]);
		if (regex_search(ppe->url, rg)) {
			ppe->IsSignal = true;
			EventCall call = SignalCall[i];
			call(&ppe->handle);//Execute Callback
			break;
		}
	}
	ppe->EventStatus = true;
}
