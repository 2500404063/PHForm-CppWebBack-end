#pragma once
#include "globe.h"
#include <regex>

string Http_GetRequestWay(string request);
string Http_GetRequestHost(string request);
string Http_GetRequestUrl(string request);
string Http_GetRequestSignal(string request);
string Http_GetRequestData(string request);
string Http_DownToUp(string text);
string Http_UpToDown(string text);
string Http_GetFileType(string text);