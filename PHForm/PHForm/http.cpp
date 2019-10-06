#include <http.h>
#include "http.h"

string Http_GetRequestWay(string request)
{
	regex rg("^.{3,4}");
	smatch result;
	if (regex_search(request, result, rg)) {
		return regex_replace(result.str(), regex("\\s"), "");
	}
	else {
		return "";
	}
}

string Http_GetRequestHost(string request)
{
	regex rg("Host.{0,}\\s", regex_constants::icase);
	smatch result;
	if (regex_search(request, result, rg)) {
		regex rg2("(HOST:)|(\\s)", regex_constants::icase);
		return regex_replace(result.str(), rg2, "");
	}
	else {
		return "";
	}
}

string Http_GetRequestUrl(string request)
{
	regex rg("/.{0,}HTTP");
	smatch result;
	if (regex_search(request, result, rg)) {
		return result.str().substr(0, result.str().size() - 5);
	}
	else {
		return "";
	}

}

string Http_GetRequestSignal(string request)
{
	string temp = Http_GetRequestUrl(request);
	if (!temp.empty()) return temp.substr(1, temp.size() - 1);
	else return "";
}

string Http_GetRequestData(string request)
{
	regex rg("[\\s]{4,}");
	smatch result;
	regex_search(request, result, rg);
	return result.suffix();
}

string Http_DownToUp(string text)
{
	regex rg("\\\\");
	return regex_replace(text, rg, "/");
}

string Http_UpToDown(string text)
{
	regex rg("/");
	return regex_replace(text, rg, "\\");
	return string();
}

string Http_GetFileType(string text)
{
	regex rg1("(\\.html)", regex_constants::icase);
	regex rg2("(\\.jpg)", regex_constants::icase);
	regex rg3("(\\.mp4)", regex_constants::icase);
	regex rg4("(\\.png)", regex_constants::icase);
	regex rg5("(\\.css)", regex_constants::icase);
	regex rg6("(\\.js)", regex_constants::icase);
	if (regex_search(text, rg1)) {
		return "text/html";
	}
	else if (regex_search(text, rg2)) {
		return "application/x-jpg";
	}
	else if (regex_search(text, rg3)) {
		return "video/mpeg4";
	}
	else if (regex_search(text, rg4)) {
		return "application/x-png";
	}
	else if (regex_search(text, rg5)) {
		return "text/css";
	}
	else if (regex_search(text, rg6)) {
		return "application/x-javascript";
	}
	else {
		return "text/plain";
	}
}
