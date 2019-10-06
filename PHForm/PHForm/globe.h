#pragma once
#include "sun_epoll.h"
#include "sun_iocp.h"

#include <iostream>
#include <string>
#include <thread>

using namespace std;

#pragma warning(disable:)

#ifdef _MSC_VER
typedef sun_iocp sun_http;
#else
typedef sun_epoll sun_http
#endif // MSVC

typedef void(*callBack)(const char* BackMessage);

enum HttpType
{
	GET = 0, POST = 1
};

#define GET 0
#define POST 1