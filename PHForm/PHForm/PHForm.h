#pragma once
#include "globe.h"
#include <fstream>
#include <sstream>
#include "http.h"

struct _Event_Handle_ {
	string RequestData;
	string ReseponseData;
	string ReseponseCharset = "UTF-8";
};
typedef _Event_Handle_ EventHandle, * PEventHandle;

struct _PHForm_Event
{
	string url;
	EventHandle handle;
	bool EventStatus = false;
	bool IsSignal = false;
};
typedef _PHForm_Event PHFormEvent, * PPHFormEvent;
typedef void(*EventCall)(PEventHandle handle);

class PHForm
{
public:
	void Start(const char* ip, unsigned int port, unsigned int backlog, const char* RootPath, const char* DefaultPage);
	void AddEvent(string signal_name, EventCall func);
	void DelEvent(string signal_name);
	string SplitData(PEventHandle handle, int _Off);
	void SetCharSet(string charset);
private:
	//Everything important here
	sun_http		httpsock;
	SOCKET			Server;
	thread			thread_accepting;
	thread			thread_work;
	void			accepting();
	void			work();
	void			Execution(string request, SOCKET sock);
	void			EventsController(PPHFormEvent ppe);
	//Some setting configuration
	string			DefaultPage;
	string			RootPath;
	string			CharSet = "UTF-8";
	//Some functions' setting
	vector<string>  SignalName;
	vector<EventCall> SignalCall;
};

